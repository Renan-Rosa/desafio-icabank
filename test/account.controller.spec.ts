import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from '../src/modules/account/account.controller';
import { AccountService } from '../src/modules/account/account.service';
import { HttpService } from '@nestjs/axios';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';

describe('AccountController', () => {
  let accountController: AccountController;
  let accountService: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        AccountService,
        {
          provide: HttpService,
          useValue: { post: jest.fn() }, // Mock HttpService
        },
      ],
    }).compile();

    accountController = module.get<AccountController>(AccountController);
    accountService = module.get<AccountService>(AccountService);
  });

  describe('openAccount', () => {
    it('should open a new account successfully', async () => {
      const openAccountDto = { client_id: '123' };
      const accessToken = 'valid-access-token';
      const mockResponse = { mockResponse: 'mockData', accountId: 'acc-123' };

      jest.spyOn(accountService, 'openAccount').mockResolvedValue(mockResponse);

      const result = await accountController.openAccount(
        openAccountDto,
        `Bearer ${accessToken}`,
      );
      expect(result).toEqual(mockResponse);
      expect(accountService.openAccount).toHaveBeenCalledWith(
        '123',
        'valid-access-token',
      );
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      const openAccountDto = { client_id: '123' };
      const accessToken = 'invalid-access-token';

      jest
        .spyOn(accountService, 'openAccount')
        .mockRejectedValue(new UnauthorizedException());

      try {
        await accountController.openAccount(
          openAccountDto,
          `Bearer ${accessToken}`,
        );
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
      }
    });
  });

  describe('getStatement', () => {
    it('should return the account balance', async () => {
      const accountId = 'acc-123';
      const mockAccount = { balance: 100 };

      jest.spyOn(accountService, 'getStatement').mockResolvedValue(mockAccount);

      const result = await accountController.getStatement({ accountId });
      expect(result).toEqual(mockAccount);
      expect(accountService.getStatement).toHaveBeenCalledWith(accountId);
    });

    it('should throw NotFoundException if account not found', async () => {
      const accountId = 'acc-123';

      jest
        .spyOn(accountService, 'getStatement')
        .mockRejectedValue(new NotFoundException());

      try {
        await accountController.getStatement({ accountId });
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
