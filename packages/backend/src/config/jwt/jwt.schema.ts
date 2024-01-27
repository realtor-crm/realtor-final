import { z } from 'zod';

export const jwtSchema = z.object({
  JWT_COOKIE_NAME: z.string()
});
