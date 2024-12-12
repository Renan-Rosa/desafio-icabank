import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../src/modules/auth/auth.controller';
import { AuthService } from '../src/modules/auth/auth.service';
import { RegisterDto, LoginDto } from '../src/modules/auth/dto/auth.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call register and return success message', async () => {
      const registerDto: RegisterDto = {
        client_id: 'client_123',
        client_secret: 'secret',
      };

      const result = { message: 'User registered successfully' };
      jest.spyOn(service, 'register').mockResolvedValue(result);

      expect(await controller.register(registerDto)).toBe(result);
    });

    it('should throw BadRequestException if user already exists', async () => {
      const registerDto: RegisterDto = {
        client_id: 'client_123',
        client_secret: 'secret',
      };

      jest
        .spyOn(service, 'register')
        .mockRejectedValue(new BadRequestException('User already exists'));

      try {
        await controller.register(registerDto);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('login', () => {
    it('should call login and return an access token', async () => {
      const loginDto: LoginDto = {
        client_id: 'client_123',
        client_secret: 'secret',
      };

      const result = { access_token: 'some_token' };
      jest.spyOn(service, 'login').mockResolvedValue(result);

      expect(await controller.login(loginDto)).toBe(result);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const loginDto: LoginDto = {
        client_id: 'client_123',
        client_secret: 'wrong_secret',
      };

      jest
        .spyOn(service, 'login')
        .mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      try {
        await controller.login(loginDto);
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
