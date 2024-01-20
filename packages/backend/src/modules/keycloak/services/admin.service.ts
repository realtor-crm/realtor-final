import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { RequiredActionAlias } from '@keycloak/keycloak-admin-client/lib/defs/requiredActionProviderRepresentation';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';
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

  public async issueGrant(username: string, password: string, clientId: string) {
    return await this.adminClient.auth({
      grantType: 'password',
      username,
      password,
      clientId
    });
  }

  private async authenticateAdmin() {
    const { clientId, clientSecret } = this.kcConfig;
    await this.adminClient.auth({
      grantType: 'client_credentials',
      clientId,
      clientSecret
    });
  }

  public async createKeycloakUser({
    registerDto,
    verifyEmail,
    activeProfile = true
  }: {
    registerDto: LocalRegisterDto;
    verifyEmail: boolean;
    activeProfile: boolean;
  }) {
    const { email, firstName, lastName, password } = registerDto;

    await this.authenticateAdmin();

    const existingKeycloakUsers = await this.findUsersByEmail(registerDto.email);
    if (existingKeycloakUsers?.length) {
      throw new ConflictException('User already exists');
    }

    const keycloakUser = await this.adminClient.users.create({
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
    if (!keycloakUser) {
      throw new InternalServerErrorException('Cannot create user');
    }

    return keycloakUser;
  }
  public async findUsersByEmail(email: string): Promise<UserRepresentation[] | undefined> {
    await this.authenticateAdmin();

    return this.adminClient.users.find({
      email
    });
  }

  public async deleteUserById(id: string) {
    await this.authenticateAdmin();

    return this.adminClient.users.del({
      id
    });
  }

  public async logoutUser(userId: string) {
    await this.authenticateAdmin();

    return this.adminClient.users.logout({
      id: userId
    });
  }
}
