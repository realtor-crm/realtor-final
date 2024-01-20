import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { KeycloakConnectModule } from 'nest-keycloak-connect';
import { keycloakConfig } from '../config';
import { KEYCLOAK_ADMIN_CLIENT } from './constants';
import { KeycloakAdminService } from './services/admin.service';
import { KeycloakConfigService } from './services/config.service';
import { KeycloakGrantService } from './services/grant.service';

@Module({
  imports: [
    KeycloakConnectModule.registerAsync({
      useClass: KeycloakConfigService
    })
  ],
  providers: [
    {
      provide: KEYCLOAK_ADMIN_CLIENT,
      inject: [keycloakConfig.KEY],
      useFactory: (kcConfig: ConfigType<typeof keycloakConfig>) => {
        return new KeycloakAdminClient({
          baseUrl: kcConfig.serverUrl,
          realmName: kcConfig.realm
        });
      }
    },
    KeycloakConfigService,
    KeycloakAdminService,
    KeycloakGrantService
  ],
  exports: [KeycloakConnectModule, KeycloakAdminService, KeycloakGrantService]
})
export class KeycloakModule {}
