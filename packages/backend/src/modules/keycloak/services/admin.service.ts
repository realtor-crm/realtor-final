import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { RequiredActionAlias } from '@keycloak/keycloak-admin-client/lib/defs/requiredActionProviderRepresentation';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { keycloakConfig } from '../../config';
import { LocalRegisterDto } from '../../local-auth/dtos/register.dto';
import { KEYCLOAK_ADMIN_CLIENT } from '../constants';

@Injectable()
export class KeycloakAdminService {
  constructor(
    @Inject(keycloakConfig.KEY)
    private readonly kcConfig: ConfigType<typeof keycloakConfig>,
    @Inject(KEYCLOAK_ADMIN_CLIENT)
    private readonly adminClient: KeycloakAdminClient
  ) {}

  private async authenticateAdmin() {
    await this.adminClient.auth({
      grantType: 'client_credentials',
      clientId: this.kcConfig.clientId,
      clientSecret: this.kcConfig.secret
    });
  }

  private async createKeycloakUser(
    registerDto: LocalRegisterDto,
    verifyEmail: boolean,
    activeProfile = true
  ) {
    const { email, firstName, lastName, password } = registerDto;

    return await this.adminClient.users.create({
      username: email,
      firstName,
      lastName,
      email,
      enabled: activeProfile,
      emailVerified: true,
      groups: [],
      requiredActions: verifyEmail ? [RequiredActionAlias.VERIFY_EMAIL] : [],
      credentials: [
        {
          type: 'password',
          value: password,
          temporary: false
        }
      ]
    });
  }
}
