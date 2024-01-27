import { registerAs } from '@nestjs/config';

export const kyselyConfig = registerAs('kysely', () => ({
  database_url: process.env.DATABASE_URL!
}));
