export interface Configuration {
  port: number;
  corsOrigin: string;
}

export const configuration = (): Configuration => ({
  port: parseInt(process.env.PORT ?? '3000'),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:8000'
});
