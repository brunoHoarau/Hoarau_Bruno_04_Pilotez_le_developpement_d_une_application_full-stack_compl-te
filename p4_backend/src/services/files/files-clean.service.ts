import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { FilesService } from './files.services';

@Injectable()
export class FilesCleanService {
  constructor(
    private readonly filesService: FilesService,
  ) {}

  @Cron('0 0 * * *')
  async handleExpiredFiles() {
    console.log('Nettoyage des fichiers expirés...');

    await this.filesService.deleteExpiredPhysicalFiles();
  }
}