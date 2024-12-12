import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { Env } from './env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: ['error', 'log'],
  });

  // Configuração do serviço utilizando a tipagem do arquivo EnvSchema
  const configService = app.get<ConfigService<Env, true>>(ConfigService);

  const port = configService.get('PORT', { infer: true });

  await app.listen(port);
}

bootstrap();
