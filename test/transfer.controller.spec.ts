import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { TransferDto } from '../src/modules/transfer/dto/transfer.dto';
import { TransferService } from '../src/modules/transfer/transfer.service';
import { TransferController } from '../src/modules/transfer/transfer.controller';

describe('TransferController', () => {
  let controller: TransferController;
  let service: TransferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransferController],
      providers: [
        {
          provide: TransferService,
          useValue: {
            transferFunds: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransferController>(TransferController);
    service = module.get<TransferService>(TransferService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('transfer', () => {
    it('should throw BadRequestException if authorization token is missing', async () => {
      const transferData: TransferDto = {
        amount: 1000,
        account: '12345',
        currency: 'BRL',
      };

      try {
        await controller.transfer(transferData, '');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Authorization token is required');
      }
    });

    it('should call transferFunds service method with valid token and data', async () => {
      const transferData: TransferDto = {
        amount: 1000,
        account: '12345',
        currency: 'BRL',
      };
      const authorization = 'Bearer valid_token';
      const transferResponse = { success: true, transactionId: 'abc123' };

      jest.spyOn(service, 'transferFunds').mockResolvedValue(transferResponse);

      const result = await controller.transfer(transferData, authorization);

      expect(service.transferFunds).toHaveBeenCalledWith(
        'valid_token',
        transferData,
      );
      expect(result).toEqual(transferResponse);
    });
  });
});
