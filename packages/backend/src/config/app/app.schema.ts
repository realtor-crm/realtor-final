import { z } from 'zod';

export const appSchema = z.object({
  PORT: z.string(),
  CORS_ORIGIN: z.string().url()
});
