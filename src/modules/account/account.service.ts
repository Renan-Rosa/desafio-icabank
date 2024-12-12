import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AccountService {
  private accounts: {
    accountId: string;
    client_id: string;
    balance: number;
    transactions: any[];
  }[] = []; // Simula banco de dados

  constructor(private readonly httpService: HttpService) {}

  // Abertura de conta integrada com o Mock
  async openAccount(
    client_id: string,
    accessToken: string,
  ): Promise<{ mockResponse: any; accountId: string }> {
    const mockBackendUrl = `${process.env.MOCK_URL}/mock-account/open`;

    try {
      // Requisição POST para o mock backend com o token no header de autorização
      const response = await lastValueFrom(
        this.httpService.post(
          mockBackendUrl,
          { client_id },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        ),
      );

      // Simula o salvamento local
      const accountId = `acc-${Date.now()}`;
      this.accounts.push({
        accountId,
        client_id,
        balance: 0,
        transactions: [],
      });

      // Retorna a resposta do mock e o accountId
      return {
        mockResponse: response.data,
        accountId,
      };
    } catch (error) {
      if (error.response?.status === 401) {
        throw new UnauthorizedException('Invalid token');
      }
      throw new HttpException(
        'Error connecting to mock backend',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  // Retorna os dados da conta ( balanço ...)
  async getStatement(accountId: string): Promise<{ balance: number }> {
    const account = this.accounts.find((acc) => acc.accountId === accountId);
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return { balance: account.balance };
  }
}
