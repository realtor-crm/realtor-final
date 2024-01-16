import { Module } from '@nestjs/common';
import { KeycloakModule } from '../keycloak/keycloak.module';
import { LocalAuthController } from './local-auth.controller';
import { LocalAuthService } from './local-auth.service';

@Module({
  controllers: [LocalAuthController],
  providers: [LocalAuthService],
  imports: [KeycloakModule]
})
export class LocalAuthModule {}
