import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { KeycloakConnectModule } from 'nest-keycloak-connect';
import { keycloakConfig } from '../config';
import { KEYCLOAK_ADMIN_CLIENT } from './constants';
import { KeycloakAdminService } from './services/admin.service';
import { KeycloakConfigService } from './services/config.service';
import { KeycloakGrantService } from './services/grant.service';
import { KeycloakUrlService } from './services/url.service';

@Module({
  imports: [
    KeycloakConnectModule.registerAsync({
      useClass: KeycloakConfigService
    }),
    HttpModule
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
    KeycloakGrantService,
    KeycloakUrlService
  ],
  exports: [KeycloakConnectModule, KeycloakAdminService, KeycloakGrantService, KeycloakUrlService]
})
export class KeycloakModule {}
