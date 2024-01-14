import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  KeycloakConnectOptions,
  KeycloakConnectOptionsFactory,
  PolicyEnforcementMode,
  TokenValidation
} from 'nest-keycloak-connect';
import { Configuration } from '@/config/configuration';

@Injectable()
export class KeycloakConfigService implements KeycloakConnectOptionsFactory {
  constructor(private readonly configService: ConfigService<Configuration>) {}
  createKeycloakConnectOptions(): KeycloakConnectOptions {
    return {
      authServerUrl: this.configService.getOrThrow('kcServerUrl'),
      realm: this.configService.getOrThrow('kcRealm'),
      clientId: this.configService.getOrThrow('kcClientId'),
      secret: this.configService.getOrThrow('kcSecret'),
      bearerOnly: true,
      useNestLogger: true,
      cookieKey: 'KEYCLOAK_JWT',
      policyEnforcement: PolicyEnforcementMode.ENFORCING,
      tokenValidation: TokenValidation.ONLINE
    };
  }
}
