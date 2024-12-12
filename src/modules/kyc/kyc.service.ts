import { Injectable, BadRequestException } from '@nestjs/common'; // Importe o BadRequestException
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class KycService {
  private readonly uploadDir = './uploads'; // Diretório para salvar os arquivos

  constructor() {
    // Verifica se o diretório de uploads existe, se não, cria
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir);
    }
  }

  // Função para salvar o arquivo
  saveFile(file: Express.Multer.File): string {
    if (!file) {
      throw new BadRequestException('File is missing'); // Lança BadRequestException se o arquivo não estiver presente
    }

    const filePath = path.join(this.uploadDir, file.originalname);
    fs.writeFileSync(filePath, file.buffer); // Salva o arquivo usando o buffer
    return filePath;
  }
}
