import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { TokenResponse } from '../auth/types/auth.types';
import { KeycloakGrantService } from '../keycloak/services/grant.service';
import { KeycloakError } from '../keycloak/types/error.type';
import { LocalLoginDto } from './dtos/login.dto';
import { LocalRegisterDto } from './dtos/register.dto';

@Injectable()
export class LocalAuthService {
  constructor(private readonly grantService: KeycloakGrantService) {}
  async login(loginDto: LocalLoginDto): Promise<any> {
    const { email, password } = loginDto;

    try {
      const grant = await this.grantService.issueGrant({ email, password });

      const { access_token, refresh_token, expires_in } = grant;

      if (!access_token) {
        throw new InternalServerErrorException('Cannot issue token');
      }
      console.log(JSON.stringify(access_token));

      const keycloakUser = await this.grantService.getUserInfoFromToken(access_token);

      if (!keycloakUser) {
        throw new InternalServerErrorException('Cannot get user info from token');
      }

      //get user from db
      //if user doesnt exist in db throw internal server error so we know db isnt synced with keycloak

      return {
        refreshToken: refresh_token,
        accessToken: access_token,
        expires: expires_in
      };
    } catch (error) {
      if ((error as Error)?.message === '401:Unauthorized') {
        const keycloakError = error as KeycloakError;
        throw new UnauthorizedException(keycloakError.message, keycloakError.response?.data);
      }
      throw error;
    }
  }

  async register(registerDto: LocalRegisterDto) {
    return 'register';
  }

  async logout() {
    return 'logout';
  }
}
