import { z } from 'zod';

export const redisSchema = z.object({
  REDIS_URL: z.string().url(),
  REDIS_TTL: z.string().regex(/^\d+$/)
});
