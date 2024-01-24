import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException
} from '@nestjs/common';
import KeycloakConnect, { Grant, Token } from 'keycloak-connect';
import { KEYCLOAK_INSTANCE } from 'nest-keycloak-connect';
import { KeycloakError } from '../types/error.type';
import { GuaranteedGrant, KeycloakTokenParsed } from '../types/grant.type';

//! keycloak-connect is missing the token property from the Token type... :)
declare module 'keycloak-connect' {
  interface Token {
    token: string | undefined;
    content: KeycloakTokenParsed | undefined;
  }
}

@Injectable()
export class KeycloakGrantService {
  constructor(
    @Inject(KEYCLOAK_INSTANCE)
    private readonly keycloak: KeycloakConnect.Keycloak
  ) {}
  private isGrantWithRequiredTokens(grant: Grant): grant is GuaranteedGrant {
    if (!grant.access_token || !grant.refresh_token) {
      return false;
    }
    if (!grant.access_token.token || !grant.refresh_token.token) {
      return false;
    }
    return true;
  }

  public async getUserInfoFromToken(token: Token): Promise<any> {
    return this.keycloak.grantManager.userInfo(token);
  }

  public async issueGrant({
    email,
    password
  }: {
    email: string;
    password: string;
  }): Promise<GuaranteedGrant> {
    try {
      const grant = await this.keycloak.grantManager.obtainDirectly(email, password);
      if (!this.isGrantWithRequiredTokens(grant)) {
        throw new InternalServerErrorException('Cannot issue token');
      }

      return grant;
    } catch (error) {
      if ((error as Error)?.message === '401:Unauthorized') {
        const keycloakError = error as KeycloakError;
        throw new UnauthorizedException(keycloakError.message, keycloakError.response?.data);
      }
      throw error;
    }
  }

  public async issueGrantFromRefreshToken(refreshToken: string): Promise<any> {
    //TODO
  }
}
