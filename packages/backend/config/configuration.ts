export interface Configuration {
  port: number;
  corsOrigin: string;
  kcServerUrl: string;
  kcRealm: string;
  kcClientId: string;
  kcSecret: string;
}

export const configuration: () => Configuration = () => ({
  port: parseInt(process.env.PORT ?? '3000'),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:8000',
  kcServerUrl: process.env.KC_SERVER_URL ?? 'http://localhost:8080',
  kcRealm: process.env.KC_REALM ?? 'master',
  kcClientId: process.env.KC_CLIENT_ID ?? 'my-nestjs-app',
  kcSecret: process.env.KC_SECRET ?? 'secret'
});
