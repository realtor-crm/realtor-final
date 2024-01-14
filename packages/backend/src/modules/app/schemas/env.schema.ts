import { z } from 'zod';

export const envValidationSchema = z.object({
  PORT: z.string(),
  CORS_ORIGIN: z.string().url(),
  KC_SERVER_URL: z.string().url(),
  KC_REALM: z.string(),
  KC_CLIENT_ID: z.string(),
  KC_SECRET: z.string()
});
