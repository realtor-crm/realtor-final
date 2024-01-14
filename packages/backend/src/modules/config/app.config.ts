import { registerAs } from '@nestjs/config';

const appConfig = () => ({
  port: parseInt(process.env.PORT!),
  corsOrigin: process.env.CORS_ORIGIN!
});

export default registerAs('app', appConfig);
