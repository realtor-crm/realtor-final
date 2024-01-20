import { z } from 'zod';

const keycloakSchema = z.object({
  KC_SERVER_URL: z.string().url(),
  KC_REALM: z.string(),
  KC_CLIENT_ID: z.string(),
  KC_CLIENT_SECRET: z.string()
});

const databaseSchema = z.object({
  DATABASE_URL: z.string().url()
});

const appSchema = z.object({
  PORT: z.string(),
  CORS_ORIGIN: z.string().url()
});

const jwtSchema = z.object({
  JWT_COOKIE_NAME: z.string()
});

const schemas = [keycloakSchema, databaseSchema, appSchema, jwtSchema];

export const envSchema = schemas.reduce((acc, schema) => acc.merge(schema), z.object({}));
