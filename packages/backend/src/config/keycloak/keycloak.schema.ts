import { z } from 'zod';

export const keycloakSchema = z.object({
  KC_SERVER_URL: z.string().url(),
  KC_REALM: z.string(),
  KC_CLIENT_ID: z.string(),
  KC_CLIENT_SECRET: z.string()
});
