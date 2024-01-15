import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { KeycloakConnectModule } from 'nest-keycloak-connect';
import { keycloakConfig } from '../config';
import { KEYCLOAK_ADMIN_CLIENT } from './constants';
import { KeycloakAdminService } from './services/admin.service';
import { KeycloakConfigService } from './services/config.service';

@Module({
  imports: [
    KeycloakConnectModule.registerAsync({
      useClass: KeycloakConfigService
    })
  ],
  providers: [
    KeycloakConfigService,
    KeycloakAdminService,
    {
      provide: KEYCLOAK_ADMIN_CLIENT,
      inject: [keycloakConfig.KEY],
      useFactory: (kcConfig: ConfigType<typeof keycloakConfig>) => {
        return new KeycloakAdminClient({
          baseUrl: kcConfig['auth-server-url'],
          realmName: kcConfig.realm
        });
      }
    }
  ],
  exports: [KeycloakConnectModule, KeycloakAdminService]
})
export class KeycloakModule {}
