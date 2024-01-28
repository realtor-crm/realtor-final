import { TokenResponseRaw } from '@keycloak/keycloak-admin-client/lib/utils/auth';
import { HttpService } from '@nestjs/axios';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  LoggerService,
  UnauthorizedException
} from '@nestjs/common';
import { AxiosResponse } from 'axios';
import KeycloakConnect, { Grant, Token } from 'keycloak-connect';
import { KEYCLOAK_INSTANCE } from 'nest-keycloak-connect';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { catchError, map, Observable } from 'rxjs';
import { TokenResponse } from '../../auth/types/auth.types';
import { KeycloakError } from '../types/error.type';
import { GuaranteedGrant, KeycloakTokenParsed } from '../types/grant.type';
import { KeycloakUrlService } from './url.service';

//! keycloak-connect is missing the token property from the Token type... :)
declare module 'keycloak-connect' {
  interface Token {
    token: string | undefined;
    content: KeycloakTokenParsed | undefined;
  }
}

type KeycloakErrorResponse = { error: string; error_description: string };

@Injectable()
export class KeycloakGrantService {
  constructor(
    @Inject(KEYCLOAK_INSTANCE)
    private readonly keycloak: KeycloakConnect.Keycloak,
    private readonly httpService: HttpService,
    private readonly urlService: KeycloakUrlService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService
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
      } else if ((error as Error)?.message === '400:Bad Request') {
        //TODO internationalization
        throw new UnauthorizedException('You must verify your email before logging in!');
      }
      throw error;
    }
  }

  public issueGrantFromRefreshToken(refreshToken: string): Observable<TokenResponse> {
    const tokenUrl = this.urlService.getTokenUrl();

    const data = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    };

    const params = new URLSearchParams({
      ...this.urlService.getRequestSecrets(),
      ...data
    });

    return this.httpService.post<TokenResponseRaw>(tokenUrl, params).pipe(
      map((res: AxiosResponse<TokenResponseRaw>) => ({
        refresh_token: res.data.refresh_token,
        access_token: res.data.access_token
      })),
      catchError(({ response }: { response: AxiosResponse<KeycloakErrorResponse> }) => {
        const error = response.data;

        this.logger.error(
          "Couldn't get authentication from keycloak. Error: " + JSON.stringify(error)
        );

        if (error.error === 'invalid_grant') {
          throw new UnauthorizedException('InvalidRefreshTokenError');
        }

        throw new InternalServerErrorException('CannotIssueTokenError');
      })
    );
  }
}
