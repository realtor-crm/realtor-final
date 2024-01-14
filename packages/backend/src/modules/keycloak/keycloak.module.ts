import { Module } from '@nestjs/common';
import { KeycloakConnectModule } from 'nest-keycloak-connect';
import { KeycloakConfigService } from './services/config.service';

@Module({
  imports: [
    KeycloakConnectModule.registerAsync({
      useClass: KeycloakConfigService
    })
  ],
  providers: [KeycloakConfigService],
  exports: [KeycloakConnectModule]
})
export class KeycloakModule {}
