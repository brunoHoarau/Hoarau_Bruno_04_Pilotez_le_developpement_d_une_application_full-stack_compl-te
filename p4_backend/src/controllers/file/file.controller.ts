import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Req,
  Res,
  Param,
  ParseFilePipe,
  MaxFileSizeValidator,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';

import { FilesService } from '../../services/files/files.services';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import path from 'path';
import { diskStorage } from 'multer';
import { randomBytes } from 'crypto';
import * as fs from 'fs';

const forbiddenExtensions = [
    ".exe",
    ".bat",
    ".cmd",
    ".com",
    ".msi",
    ".scr",
    ".pif",
    ".ps1",
    ".vbs",
    ".vbe",
    ".js",
    ".jse",
    ".jar",
    ".ws",
    ".wsf",
    ".wsc",
    ".hta",
];

const MAX_FILE_SIZE =  1 * 1024 * 1024 * 1024;

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
  ) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
        storage: diskStorage({
        destination: './uploads',

        filename: (req, file, callback) => {
          const extension = path.extname(file.originalname);

          const uniqueName =
            `${Date.now()}-${randomBytes(16).toString('hex')}${extension}`;

          callback(null, uniqueName);
        },
      }),

        fileFilter: (req, file, callback) => {
            const extension = path
            .extname(file.originalname)
            .toLowerCase();

            if (forbiddenExtensions.includes(extension)) {
            return callback(
                new BadRequestException(
                `Le fichier ${extension} est interdit.`,
                ),
                false,
            );
        }

        callback(null, true);
      },
    }),
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: MAX_FILE_SIZE,
          }),
        ],
      }),
    )
    file: any,

    @Req() req: any,

    @Body('expirationDays') expirationDays?: string,

    @Body('password') password?: string,
  ) {

    if (!file) {
    throw new BadRequestException(
        'Aucun fichier n’a été envoyé.',
        );
    }
    const expiration = expirationDays
      ? Number(expirationDays)
      : 7;

    return this.filesService.upload(
      file,
      req.user.userId,
      expiration,
      password,
    );
  }

  @Get('my-files')
  @UseGuards(JwtAuthGuard)
  getMyFiles(@Req() req: any) {
    return this.filesService.findByUser(req.user.userId);
  }

  @Get('download/:token')
  getDownloadInfo(@Param('token') token: string) {
    return this.filesService.getDownloadInfo(token);
  }

  @Post('download/:token')
  async downloadFile(
    @Param('token') token: string,
    @Body('password') password: string | undefined,
    @Res() res: Response,
  ) {
    const file = await this.filesService.verifyDownload(token, password);

    res.set({
      'Content-Type': file.mimetype,
      'Content-Disposition': `attachment; filename="${encodeURIComponent(file.originalName)}"`,
    });

    const stream = fs.createReadStream(file.storagePath);

    stream.on('error', () => {
      if (!res.headersSent) {
        res.status(404).json({ message: 'Fichier introuvable' });
      }
    });

    stream.pipe(res);
  }
}