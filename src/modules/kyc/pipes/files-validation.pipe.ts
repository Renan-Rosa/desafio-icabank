import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '']; // Extensões permitidas
  private readonly maxFileSize = 5 * 1024 * 1024; // Limite de 5MB

  transform(value: any) {
    const file = value[0]; // Para o FileInterceptor, o arquivo estará em value[0]

    if (!file) {
      throw new BadRequestException('File not found');
    }

    const fileExtension = path.extname(file.originalname).toLowerCase();
    const fileSize = file.size;

    if (!this.allowedExtensions.includes(fileExtension)) {
      throw new BadRequestException('Invalid file type');
    }

    if (fileSize > this.maxFileSize) {
      throw new BadRequestException('File size exceeds the limit');
    }

    return value;
  }
}
