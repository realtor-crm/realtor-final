import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.PORT!),
  corsOrigin: process.env.CORS_ORIGIN!
}));
