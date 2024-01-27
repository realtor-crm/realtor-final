import { registerAs } from '@nestjs/config';

export const redisConfig = registerAs('redis', () => ({
  redisUrl: process.env.REDIS_URL!,
  redisTtl: parseInt(process.env.REDIS_TTL!)
}));
