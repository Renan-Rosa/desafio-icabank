import { IsNotEmpty, IsString } from 'class-validator';

export class OpenAccountDto {
  @IsNotEmpty()
  @IsString()
  client_id: string;
}

export class StatementQueryDto {
  @IsNotEmpty()
  @IsString()
  accountId: string;
}
