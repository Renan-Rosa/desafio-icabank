import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import * as path from 'path';
import { BadRequestException } from '@nestjs/common';
import { KycService } from '../src/modules/kyc/kyc.service';

jest.mock('fs'); // Mantém o mock do fs

describe('KycService', () => {
  let service: KycService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KycService],
    }).compile();

    service = module.get<KycService>(KycService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveFile', () => {
    it('should save the file and return the correct path', () => {
      const file = {
        originalname: 'document.pdf',
        buffer: Buffer.from('file data'),
      } as Express.Multer.File;
      const filePath = path.join(service['uploadDir'], file.originalname);

      // Usar jest.spyOn() para espionar a função writeFileSync
      const writeFileSyncSpy = jest
        .spyOn(fs, 'writeFileSync')
        .mockImplementation(() => {});

      const result = service.saveFile(file);

      expect(writeFileSyncSpy).toHaveBeenCalledWith(filePath, file.buffer);
      expect(result).toBe(filePath);

      // Limpeza: restaurar o comportamento original da função
      writeFileSyncSpy.mockRestore();
    });

    it('should throw BadRequestException if the file is missing', () => {
      const file = null as unknown as Express.Multer.File;

      try {
        service.saveFile(file);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe('File is missing');
      }
    });
  });

  describe('constructor', () => {
    it('should create the upload directory if it does not exist', () => {
      // Espionando fs.existsSync e mockando a resposta
      const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false);
      const mkdirSyncSpy = jest.spyOn(fs, 'mkdirSync').mockImplementation(); // Mock sem retorno

      new KycService();

      expect(existsSyncSpy).toHaveBeenCalledWith(service['uploadDir']);
      expect(mkdirSyncSpy).toHaveBeenCalledWith(service['uploadDir']);

      // Limpeza: restaurar o comportamento original das funções
      existsSyncSpy.mockRestore();
      mkdirSyncSpy.mockRestore();
    });
  });
});
