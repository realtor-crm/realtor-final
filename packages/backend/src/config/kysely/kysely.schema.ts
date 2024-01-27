import { z } from 'zod';

export const kyselySchema = z.object({
  DATABASE_URL: z.string().url()
});
