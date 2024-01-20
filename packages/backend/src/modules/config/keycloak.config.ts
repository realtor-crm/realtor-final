import { registerAs } from '@nestjs/config';

export const keycloakConfig = registerAs('keycloak', () => ({
  serverUrl: process.env.KC_SERVER_URL!,
  realm: process.env.KC_REALM!,
  clientId: process.env.KC_CLIENT_ID!,
  clientSecret: process.env.KC_CLIENT_SECRET!
}));
