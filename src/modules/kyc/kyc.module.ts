import { Module } from '@nestjs/common';
import { KycController } from './kyc.controller';
import { FileValidationPipe } from './pipes/files-validation.pipe';
import { KycService } from './kyc.service';

@Module({
  controllers: [KycController],
  providers: [FileValidationPipe, KycService],
})
export class KycModule {}
