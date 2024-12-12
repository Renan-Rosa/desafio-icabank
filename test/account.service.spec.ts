import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import {
  UnauthorizedException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { AccountService } from '../src/modules/account/account.service';
import { AxiosResponse } from 'axios';

describe('AccountService', () => {
  let accountService: AccountService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: HttpService,
          useValue: { post: jest.fn() }, // Mock HttpService
        },
      ],
    }).compile();

    accountService = module.get<AccountService>(AccountService);
    httpService = module.get<HttpService>(HttpService);
  });

  describe('openAccount', () => {
    it('should open a new account and return account details', async () => {
      const mockResponse = { mockResponse: 'mockData' };
      const mockAxiosResponse: AxiosResponse = {
        data: { mockResponse: 'mockData' },
        status: 200,
        statusText: 'OK',
        headers: {}, // Ou defina conforme a estrutura esperada de headers
        config: { headers: undefined }, // Ou defina conforme a estrutura esperada de config
        request: {} as any, // `request` é exigido em AxiosResponse mas pode ser `any` para o mock
      };

      jest.spyOn(httpService, 'post').mockReturnValue(of(mockAxiosResponse)); // Envolver a resposta em 'of()'

      const result = await accountService.openAccount(
        'client-123',
        'valid-access-token',
      );
      expect(result).toEqual({ mockResponse, accountId: result.accountId });
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      jest
        .spyOn(httpService, 'post')
        .mockReturnValue(throwError(() => ({ response: { status: 401 } })));

      try {
        await accountService.openAccount('client-123', 'invalid-access-token');
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('should throw HttpException for mock backend error', async () => {
      jest
        .spyOn(httpService, 'post')
        .mockReturnValue(throwError(() => new Error('Mock error')));

      try {
        await accountService.openAccount('client-123', 'valid-access-token');
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.getStatus()).toBe(HttpStatus.BAD_GATEWAY);
      }
    });
  });

  describe('getStatement', () => {
    it('should return the balance of an account', async () => {
      const account = {
        accountId: 'acc-123',
        client_id: 'client-123', // Adicionado o client_id
        balance: 100,
        transactions: [],
      };
      accountService['accounts'] = [account];

      const result = await accountService.getStatement('acc-123');
      expect(result).toEqual({ balance: 100 });
    });

    it('should throw NotFoundException if account not found', async () => {
      try {
        await accountService.getStatement('non-existent-account');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
