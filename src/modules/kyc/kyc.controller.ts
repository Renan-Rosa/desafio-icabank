import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { KycService } from './kyc.service';

@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post('upload-doc')
  @UseInterceptors(FileInterceptor('file')) // 'file' é o campo do form-data
  uploadDoc(@UploadedFile() file: Express.Multer.File) {
    const filePath = this.kycService.saveFile(file);
    return {
      message: 'Document uploaded successfully',
      filename: file.originalname,
      filePath,
    };
  }

  @Post('upload-selfie')
  @UseInterceptors(FileInterceptor('file')) // 'file' é o campo do form-data
  uploadSelfie(@UploadedFile() file: Express.Multer.File) {
    const filePath = this.kycService.saveFile(file);
    return {
      message: 'Selfie uploaded successfully',
      filename: file.originalname,
      filePath,
    };
  }
}
