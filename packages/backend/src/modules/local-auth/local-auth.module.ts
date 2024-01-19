import { Module } from '@nestjs/common';
import { KeycloakModule } from '../keycloak/keycloak.module';
import { UserModule } from '../user/user.module';
import { LocalAuthController } from './local-auth.controller';
import { LocalAuthService } from './local-auth.service';

@Module({
  controllers: [LocalAuthController],
  providers: [LocalAuthService],
  imports: [KeycloakModule, UserModule]
})
export class LocalAuthModule {}
