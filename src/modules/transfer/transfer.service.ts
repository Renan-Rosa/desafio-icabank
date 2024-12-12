import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { TransferDto } from './dto/transfer.dto';

@Injectable()
export class TransferService {
  constructor(private readonly httpService: HttpService) {}

  async transferFunds(accessToken: string, transferData: TransferDto) {
    const mockBackendUrl = `${process.env.MOCK_URL}/mock-transfer`;

    try {
      // Realiza a chamada ao Mock Backend
      const response = await lastValueFrom(
        this.httpService.post(mockBackendUrl, transferData, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Header com o token correto
          },
        }),
      );

      // Retorna a resposta do Mock Backend
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          {
            message:
              error.response.data.message || 'Error during transfer operation',
            error: error.response.data.error || 'Internal Server Error',
            statusCode: error.response.status || HttpStatus.BAD_GATEWAY,
          },
          error.response.status || HttpStatus.BAD_GATEWAY,
        );
      }
      throw new HttpException(
        'Error connecting to mock backend',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
