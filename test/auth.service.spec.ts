import { HttpService } from '@nestjs/axios';
import { UnauthorizedException, HttpException } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { of, throwError } from 'rxjs';
import { AuthService } from '../src/modules/auth/auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should login successfully and return an access token for valid credentials', async () => {
      const mockResponse: AxiosResponse = {
        data: { access_token: 'mocked-access-token' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined,
        },
      };

      const client_id = 'test'; // Credenciais corretas
      const client_secret = 'secret';

      // Mock da função post para retornar a resposta acima quando as credenciais forem corretas
      jest.spyOn(httpService, 'post').mockReturnValue(of(mockResponse));

      const result = await service.login(client_id, client_secret);
      expect(result.access_token).toBe('mocked-access-token');
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const mockError = {
        response: { status: 401, data: { error: 'Invalid credentials' } },
      };
      const client_id = 'wrong_client'; // Credenciais erradas
      const client_secret = 'wrong_secret';

      // Mock da função post para simular uma falha de autenticação
      jest
        .spyOn(httpService, 'post')
        .mockReturnValue(throwError(() => mockError));

      try {
        await service.login(client_id, client_secret);
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
        expect(e.message).toBe('Invalid credentials');
      }
    });

    it('should throw HttpException for any other error', async () => {
      const mockError = {
        response: { status: 500, data: { error: 'Server Error' } },
      };
      const client_id = 'test';
      const client_secret = 'secret';

      // Mock da função post para simular um erro de servidor
      jest
        .spyOn(httpService, 'post')
        .mockReturnValue(throwError(() => mockError));

      try {
        await service.login(client_id, client_secret);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('Error connecting to mock backend');
      }
    });
  });
});
