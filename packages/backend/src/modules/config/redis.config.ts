import { registerAs } from '@nestjs/config';

export const redisConfig = registerAs('redis', () => ({
  redisUrl: process.env.REDIS_URL
}));
