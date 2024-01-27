import { z } from 'zod';
import { appSchema, jwtSchema, keycloakSchema, kyselySchema, redisSchema } from './index';

const schemas = [keycloakSchema, kyselySchema, appSchema, jwtSchema, redisSchema];

export const envSchema = schemas.reduce((acc, schema) => acc.merge(schema), z.object({}));
