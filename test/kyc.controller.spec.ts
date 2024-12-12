import { Test, TestingModule } from '@nestjs/testing';
import { KycController } from '../src/modules/kyc/kyc.controller';
import { KycService } from '../src/modules/kyc/kyc.service';

describe('KycController', () => {
  let controller: KycController;
  let service: KycService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KycController],
      providers: [
        {
          provide: KycService,
          useValue: {
            saveFile: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<KycController>(KycController);
    service = module.get<KycService>(KycService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadDoc', () => {
    it('should call saveFile and return success message', async () => {
      const file = {
        originalname: 'document.pdf',
        buffer: Buffer.from('file data'),
      } as Express.Multer.File;
      const filePath = '/uploads/document.pdf';

      jest.spyOn(service, 'saveFile').mockReturnValue(filePath);

      const result = controller.uploadDoc(file);

      expect(result.message).toBe('Document uploaded successfully');
      expect(result.filename).toBe('document.pdf');
      expect(result.filePath).toBe(filePath);
    });
  });

  describe('uploadSelfie', () => {
    it('should call saveFile and return success message', async () => {
      const file = {
        originalname: 'selfie.jpg',
        buffer: Buffer.from('file data'),
      } as Express.Multer.File;
      const filePath = '/uploads/selfie.jpg';

      jest.spyOn(service, 'saveFile').mockReturnValue(filePath);

      const result = await controller.uploadSelfie(file);

      expect(result.message).toBe('Selfie uploaded successfully');
      expect(result.filename).toBe('selfie.jpg');
      expect(result.filePath).toBe(filePath);
    });
  });
});
