import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { FilesService } from './files.services';
import { FileEntity } from '../../database/entities/file.entity';

describe('FilesService', () => {
  let service: FilesService;
  let repository: {
    create: jest.Mock;
    save: jest.Mock;
    find: jest.Mock;
    findOne: jest.Mock;
    createQueryBuilder: jest.Mock;
  };

  const baseFile = {
    filename: 'stored-name.pdf',
    originalname: 'document.pdf',
    mimetype: 'application/pdf',
    size: 1234,
    path: '/uploads/stored-name.pdf',
  };

  beforeEach(async () => {
    repository = {
      create: jest.fn((data) => data),
      save: jest.fn((data) => Promise.resolve({ id: 'uuid-1', ...data })),
      find: jest.fn(),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: getRepositoryToken(FileEntity),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  describe('upload - password protection', () => {
    it('stores no passwordHash when no password is provided', async () => {
      const result = await service.upload(baseFile, 1, 7);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({ passwordHash: null }),
      );
      expect(result).not.toHaveProperty('password');
    });

    it('hashes and stores the password when one is provided', async () => {
      await service.upload(baseFile, 1, 7, 'correct-horse');

      const createArg = repository.create.mock.calls[0][0];
      expect(createArg.passwordHash).toBeTruthy();
      expect(createArg.passwordHash).not.toBe('correct-horse');
      await expect(
        bcrypt.compare('correct-horse', createArg.passwordHash),
      ).resolves.toBe(true);
    });

    it('rejects a password shorter than 6 characters', async () => {
      await expect(
        service.upload(baseFile, 1, 7, 'ab'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getDownloadInfo', () => {
    it('returns safe metadata without the password hash', async () => {
      repository.findOne.mockResolvedValue({
        originalName: 'document.pdf',
        mimetype: 'application/pdf',
        size: 1234,
        expiresAt: new Date(Date.now() + 60_000),
        passwordHash: 'some-hash',
      });

      const info = await service.getDownloadInfo('a-token');

      expect(info).toEqual({
        originalName: 'document.pdf',
        mimetype: 'application/pdf',
        size: 1234,
        expiresAt: expect.any(Date),
        requiresPassword: true,
      });
      expect(info).not.toHaveProperty('passwordHash');
    });

    it('reports requiresPassword as false when no password is set', async () => {
      repository.findOne.mockResolvedValue({
        originalName: 'document.pdf',
        mimetype: 'application/pdf',
        size: 1234,
        expiresAt: new Date(Date.now() + 60_000),
        passwordHash: null,
      });

      const info = await service.getDownloadInfo('a-token');

      expect(info.requiresPassword).toBe(false);
    });
  });

  describe('verifyDownload', () => {
    it('returns the file when it has no password protection', async () => {
      const file = {
        storagePath: '/uploads/document.pdf',
        expiresAt: new Date(Date.now() + 60_000),
        passwordHash: null,
      };
      repository.findOne.mockResolvedValue(file);

      await expect(service.verifyDownload('a-token')).resolves.toBe(file);
    });

    it('rejects when the file is password-protected and no password is given', async () => {
      repository.findOne.mockResolvedValue({
        storagePath: '/uploads/document.pdf',
        expiresAt: new Date(Date.now() + 60_000),
        passwordHash: await bcrypt.hash('secret1', 10),
      });

      await expect(service.verifyDownload('a-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('rejects when the given password does not match', async () => {
      repository.findOne.mockResolvedValue({
        storagePath: '/uploads/document.pdf',
        expiresAt: new Date(Date.now() + 60_000),
        passwordHash: await bcrypt.hash('secret1', 10),
      });

      await expect(
        service.verifyDownload('a-token', 'wrong-pass'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('returns the file when the given password matches', async () => {
      const file = {
        storagePath: '/uploads/document.pdf',
        expiresAt: new Date(Date.now() + 60_000),
        passwordHash: await bcrypt.hash('secret1', 10),
      };
      repository.findOne.mockResolvedValue(file);

      await expect(
        service.verifyDownload('a-token', 'secret1'),
      ).resolves.toBe(file);
    });
  });
});
