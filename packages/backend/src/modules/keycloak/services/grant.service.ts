import { Inject, Injectable } from '@nestjs/common';
import KeycloakConnect, { Grant, Token } from 'keycloak-connect';
import { KEYCLOAK_INSTANCE } from 'nest-keycloak-connect';

@Injectable()
export class KeycloakGrantService {
  constructor(
    @Inject(KEYCLOAK_INSTANCE)
    private readonly keycloak: KeycloakConnect.Keycloak
  ) {}

  public async issueGrant({
    email,
    password
  }: {
    email: string;
    password: string;
  }): Promise<KeycloakConnect.Grant> {
    return this.keycloak.grantManager.obtainDirectly(email, password);
  }

  public async issueToken({
    email,
    password
  }: {
    email: string;
    password: string;
  }): Promise<Token | undefined> {
    const grant = await this.issueGrant({ email, password });
    return grant.access_token;
  }

  public async getUserInfoFromToken(token: Token) {
    return this.keycloak.grantManager.userInfo(token);
  }
}
