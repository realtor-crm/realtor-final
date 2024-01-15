import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  KeycloakConnectOptions,
  KeycloakConnectOptionsFactory,
  PolicyEnforcementMode,
  TokenValidation
} from 'nest-keycloak-connect';
import { keycloakConfig } from '../../config';

@Injectable()
export class KeycloakConfigService implements KeycloakConnectOptionsFactory {
  constructor(
    @Inject(keycloakConfig.KEY)
    private readonly kcConfig: ConfigType<typeof keycloakConfig>
  ) {}
  createKeycloakConnectOptions(): KeycloakConnectOptions {
    const { serverUrl, realm, clientId, secret } = this.kcConfig;

    return {
      authServerUrl: serverUrl,
      realm,
      clientId,
      secret,
      bearerOnly: true,
      useNestLogger: true,
      cookieKey: 'KEYCLOAK_JWT',
      policyEnforcement: PolicyEnforcementMode.ENFORCING,
      tokenValidation: TokenValidation.ONLINE
    };
  }
}
