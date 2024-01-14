import { registerAs } from '@nestjs/config';

const keycloakConfig = () => ({
  serverUrl: process.env.KC_SERVER_URL!,
  realm: process.env.KC_REALM!,
  clientId: process.env.KC_CLIENT_ID!,
  secret: process.env.KC_SECRET!
});

export default registerAs('keycloak', keycloakConfig);
