import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => ({
  cookieName: process.env.JWT_COOKIE_NAME!
}));
