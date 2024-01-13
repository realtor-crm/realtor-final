import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Configuration } from '@/config/configuration';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService<Configuration>>(ConfigService);
  const port = configService.get('port');
  await app.listen(port);
}
bootstrap();
