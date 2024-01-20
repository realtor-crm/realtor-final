import { Module } from '@nestjs/common';
import { KeycloakModule } from '../keycloak/keycloak.module';
import { LocalAuthModule } from '../local-auth/local-auth.module';
import { SocialAuthModule } from '../social-auth/social-auth.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [LocalAuthModule, SocialAuthModule, KeycloakModule],
  exports: [LocalAuthModule, SocialAuthModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
