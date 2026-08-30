import 'reflect-metadata';
import { GUARDS_METADATA } from '@nestjs/common/constants';
import * as fs from 'fs';
import { FilesController } from './file.controller';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  createReadStream: jest.fn(),
}));

describe('FilesController', () => {
  let controller: FilesController;
  let filesService: {
    upload: jest.Mock;
    findByUser: jest.Mock;
    getDownloadInfo: jest.Mock;
    verifyDownload: jest.Mock;
  };

  beforeEach(() => {
    filesService = {
      upload: jest.fn(),
      findByUser: jest.fn(),
      getDownloadInfo: jest.fn(),
      verifyDownload: jest.fn(),
    };
    controller = new FilesController(filesService as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('route protection', () => {
    it('guards the upload and my-files routes with JwtAuthGuard', () => {
      expect(
        Reflect.getMetadata(GUARDS_METADATA, controller.uploadFile),
      ).toEqual([JwtAuthGuard]);
      expect(
        Reflect.getMetadata(GUARDS_METADATA, controller.getMyFiles),
      ).toEqual([JwtAuthGuard]);
    });

    it('leaves the download routes public (no guard)', () => {
      expect(
        Reflect.getMetadata(GUARDS_METADATA, controller.getDownloadInfo),
      ).toBeUndefined();
      expect(
        Reflect.getMetadata(GUARDS_METADATA, controller.downloadFile),
      ).toBeUndefined();
    });
  });

  describe('getDownloadInfo', () => {
    it('delegates to filesService.getDownloadInfo', async () => {
      filesService.getDownloadInfo.mockResolvedValue({ originalName: 'a.pdf' });

      const result = await controller.getDownloadInfo('a-token');

      expect(filesService.getDownloadInfo).toHaveBeenCalledWith('a-token');
      expect(result).toEqual({ originalName: 'a.pdf' });
    });
  });

  describe('downloadFile', () => {
    it('verifies the password, sets headers and streams the file', async () => {
      filesService.verifyDownload.mockResolvedValue({
        originalName: 'document.pdf',
        mimetype: 'application/pdf',
        storagePath: '/uploads/document.pdf',
      });
      const fakeStream = { pipe: jest.fn(), on: jest.fn() };
      (fs.createReadStream as jest.Mock).mockReturnValue(fakeStream);
      const res = { set: jest.fn(), status: jest.fn().mockReturnThis(), json: jest.fn() };

      await controller.downloadFile('a-token', 'secret1', res as any);

      expect(filesService.verifyDownload).toHaveBeenCalledWith(
        'a-token',
        'secret1',
      );
      expect(fs.createReadStream).toHaveBeenCalledWith('/uploads/document.pdf');
      expect(res.set).toHaveBeenCalledWith(
        expect.objectContaining({
          'Content-Type': 'application/pdf',
          'Content-Disposition': expect.stringContaining('document.pdf'),
        }),
      );
      expect(fakeStream.pipe).toHaveBeenCalledWith(res);
    });
  });
});
