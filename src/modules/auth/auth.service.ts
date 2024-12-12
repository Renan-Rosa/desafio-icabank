import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  private users: { client_id: string; client_secret: string }[] = []; // Simulação de um "banco de dados"

  constructor(private readonly httpService: HttpService) {}

  // Cria um registro de usuário
  async register(
    client_id: string,
    client_secret: string,
  ): Promise<{ message: string }> {
    const userExists = this.users.find((user) => user.client_id === client_id);
    // Verifica se o usuário já existe
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    // Registra o usuário dentro do banco simulado
    this.users.push({ client_id, client_secret });
    return { message: 'User registered successfully' };
  }

  // Faz a autenticação do usuário para o mock backend
  async login(
    client_id: string,
    client_secret: string,
  ): Promise<{ access_token: string }> {
    const mockBackendUrl = `${process.env.MOCK_URL}/mock-auth/token`;

    try {
      // Faz uma requisição POST para o mock backend
      const response = await lastValueFrom(
        this.httpService.post(mockBackendUrl, { client_id, client_secret }),
      );

      // Retorna o token recebido do mock backend
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new UnauthorizedException('Invalid credentials');
      }

      throw new HttpException(
        'Error connecting to mock backend',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
