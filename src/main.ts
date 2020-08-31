import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  if (configService.get('NODE_ENV') === 'development') {
    app.enableCors();
  } else {
    const origin = configService.get('HOSTNAME');
    app.enableCors({
      origin: origin
    });
    logger.log(`Accepting requests from origin ${origin}`)
  }

  const port = configService.get('PORT', 3000);
  await app.listen(port);

  logger.log(`Application listening on port ${port}`)
}
bootstrap();
