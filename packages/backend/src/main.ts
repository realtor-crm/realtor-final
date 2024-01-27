import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get('app.port');

  app.use(cookieParser());

  app.enableCors({
    origin: configService.get('app.corsOrigin'),
    credentials: true
  });

  await app.listen(port);
}
bootstrap();
