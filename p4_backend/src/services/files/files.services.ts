import { BadRequestException, ForbiddenException, GoneException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from '../../database/entities/file.entity';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs/promises';
import { getTimeRemaining } from '../../common/utils/times.utils';

const MIN_PASSWORD_LENGTH = 6;

@Injectable()
export class FilesService {
    constructor(
        @InjectRepository(FileEntity)
        private readonly fileRepository: Repository<FileEntity>,
    ) {}

    async upload(
        file: any,
        userId: number,
        expirationDays = 7,
        password?: string,
    ) {
      
        if (
            !Number.isInteger(expirationDays) ||
            expirationDays <= 1 ||
            expirationDays >= 7
        ) {
            throw new BadRequestException(
            'La durée doit être comprise entre 1 et 7 jours.',
            );
        }

        if (password && password.length < MIN_PASSWORD_LENGTH) {
            throw new BadRequestException(
            `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`,
            );
        }

        const passwordHash = password
            ? await bcrypt.hash(password, 10)
            : null;

        const token = randomBytes(32).toString('hex');

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expirationDays);

        const newFile = this.fileRepository.create({
        token,
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        storagePath: file.path,
        passwordHash,
        expiresAt,
        userId,
        });

        const savedFile = await this.fileRepository.save(newFile);

        return {
        id: savedFile.id,
        token: savedFile.token,
        filename: savedFile.filename,
        originalName: savedFile.originalName,
        mimetype: savedFile.mimetype,
        size: savedFile.size,
        expiresAt: savedFile.expiresAt,
        };

    }

  async findByUser(userId: number) {
    const files = await this.fileRepository.find({
      where: {
        userId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  
    return files.map((file) => ({
        id: file.id,
        size: file.size,
        originalName: file.originalName,
        mimetype: file.mimetype,
        token: file.token,
        expiresAt: file.expiresAt,
        timeRemaining: getTimeRemaining(file.expiresAt),
        requiresPassword: !!file.passwordHash,
        physicalDeletedAt: file.physicalDeletedAt,
      })
      
    );
  }

  async findOneByToken(token: string) {
    const file = await this.fileRepository.findOne({
      where: { token },
    });
    console.log(file);

    if (!file) {
      throw new NotFoundException('Fichier introuvable');
    }

    if (file.expiresAt <= new Date()) {
        throw new GoneException(
            'Le lien de téléchargement a expiré.',
        );
    }

    return file;
  }

  async getDownloadInfo(token: string) {
    const file = await this.findOneByToken(token);
   

    return {
      originalName: file.originalName,
      mimetype: file.mimetype,
      size: file.size,
      expiresAt: file.expiresAt,
      timeRemaining: getTimeRemaining(file.expiresAt),
      requiresPassword: !!file.passwordHash,
      physicalDeletedAt: !!file.physicalDeletedAt,
    };
  }

    async verifyDownload(token: string, password?: string) {
      const file = await this.findOneByToken(token);
      if (!file) {
        throw new NotFoundException('Lien de téléchargement introuvable');
      }

      if (file.expiresAt && file.expiresAt < new Date()) {
        throw new ForbiddenException('Le lien de téléchargement a expiré');
      }

      if (file.passwordHash) {
        if (!password) {
          throw new UnauthorizedException('Mot de passe requis');
        }

        const isPasswordValid = await bcrypt.compare(
          password,
          file.passwordHash,
        );

        if (!isPasswordValid) {
          throw new UnauthorizedException('Mot de passe invalide');
        }
      }

      return file;
    }

    async deleteExpiredPhysicalFiles() {
        const now = new Date();

        const files = await this.fileRepository
            .createQueryBuilder('file')
            .where('file.expiresAt <= :now', { now })
            .andWhere('file.physicalDeletedAt IS NULL')
            .getMany();

        for (const file of files) {
            try {
            await fs.unlink(file.storagePath);

            file.physicalDeletedAt = now;

            await this.fileRepository.save(file);

            console.log(
                `Fichier supprimé : ${file.storagePath}`,
            );
            } catch (error: any) {
            if (error.code === 'ENOENT') {
                // Le fichier n'existe déjà plus.
                file.physicalDeletedAt = now;

                await this.fileRepository.save(file);

                console.log(
                `Fichier déjà absent : ${file.storagePath}`,
                );
            } else {
                console.error(
                `Erreur lors de la suppression de ${file.storagePath}`,
                error,
                );
            }
            }
        }
    }

    async deleteFile(token: string, userId: number) {
      const file = await this.fileRepository.findOne({
        where: {
          token,
          userId,
        },
      });

      if (!file) {
        throw new NotFoundException('Fichier introuvable');
      }

      try {
        await fs.unlink(file.storagePath);

        console.log(`Fichier physique supprimé : ${file.storagePath}`);
      } catch (error: any) {
        if (error.code === 'ENOENT') {
          throw new InternalServerErrorException(
            'Impossible de supprimer le fichier',
          );
        } 
      }

      // Suppression définitive des métadonnées
      try {
        await this.fileRepository.remove(file);
      } catch (error) {
        throw new InternalServerErrorException(
          'Impossible de supprimer les métadonnées du fichier',
        );
      }

      return {
        message: 'Fichier supprimé définitivement',
      };
    }
}