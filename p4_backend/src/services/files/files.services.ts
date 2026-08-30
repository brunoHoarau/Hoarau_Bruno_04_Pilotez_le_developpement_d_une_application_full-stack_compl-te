import { BadRequestException, GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from '../../database/entities/file.entity';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import * as fs from 'fs/promises';

@Injectable()
export class FilesService {
    constructor(
        @InjectRepository(FileEntity)
        private readonly fileRepository: Repository<FileEntity>,
    ) {}

    async upload(file: any, userId: number, expirationDays = 7) {
        if (
            !Number.isInteger(expirationDays) ||
            expirationDays < 1 ||
            expirationDays > 7
        ) {
            throw new BadRequestException(
            'La durée doit être comprise entre 1 et 7 jours.',
            );
        }

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
    return this.fileRepository.find({
      where: {
        userId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOneByToken(token: string) {
    const file = await this.fileRepository.findOne({
      where: { token },
    });

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
}