// transfer.module.ts
import { Module } from '@nestjs/common';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule], // Importa o HttpModule para fazer as requisições HTTP
  controllers: [TransferController],
  providers: [TransferService],
})
export class TransferModule {}
