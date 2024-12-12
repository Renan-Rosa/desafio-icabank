import {
  Controller,
  Post,
  Body,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { TransferDto } from './dto/transfer.dto';
import { TransferService } from './transfer.service';

@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  async transfer(
    @Body() transferData: TransferDto,
    @Headers('Authorization') authorization: string,
  ) {
    // Valida se o token está presente
    if (!authorization) {
      throw new BadRequestException('Authorization token is required');
    }

    const accessToken = authorization.split(' ')[1]; // Remove o prefixo 'Bearer'

    // Chama o serviço com os dados necessários
    return await this.transferService.transferFunds(accessToken, transferData);
  }
}
