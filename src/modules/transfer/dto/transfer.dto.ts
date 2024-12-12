import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class TransferDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  account: string;

  @IsString()
  @IsNotEmpty()
  currency: string;
}
