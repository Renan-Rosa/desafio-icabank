import { Controller, Post, Get, Body, Query, Headers } from '@nestjs/common';
import { AccountService } from './account.service';
import { OpenAccountDto, StatementQueryDto } from './dto/account.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('open')
  async openAccount(
    @Body() openAccountDto: OpenAccountDto,
    @Headers('Authorization') authorization: string, // Captura o token do header
  ) {
    const { client_id } = openAccountDto;
    const accessToken = authorization?.split(' ')[1]; // Remove o prefixo 'Bearer'
    return await this.accountService.openAccount(client_id, accessToken);
  }

  @Get('statement')
  async getStatement(@Query() query: StatementQueryDto) {
    const { accountId } = query;
    return await this.accountService.getStatement(accountId);
  }
}
