import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Req,
  ParseFilePipe,
  MaxFileSizeValidator,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { FilesService } from '../../services/files/files.services';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import path from 'path';
import { diskStorage } from 'multer';
import { randomBytes } from 'crypto';

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
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
  ) {}

  @Post('upload')
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
    );
  }

  @Get('my-files')
  getMyFiles(@Req() req: any) {
    return this.filesService.findByUser(req.user.userId);
  }
}