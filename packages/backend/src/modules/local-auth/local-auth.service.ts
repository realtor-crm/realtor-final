import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Kysely } from 'kysely';
import { DB } from '@/src/db/types';
import { TokenResponse } from '../auth/types/auth.types';
import { KeycloakGrantService } from '../keycloak/services/grant.service';
import { KYSELY_DATABASE_CONNECTION } from '../kysely/constants';
import { LocalLoginDto } from './dtos/login.dto';
import { LocalRegisterDto } from './dtos/register.dto';

//TODO hide error messages from user and add logging using winston

@Injectable()
export class LocalAuthService {
  constructor(
    private readonly grantService: KeycloakGrantService,
    @Inject(KYSELY_DATABASE_CONNECTION) private readonly kysely: Kysely<DB>
  ) {}
  async login(loginDto: LocalLoginDto): Promise<TokenResponse> {
    const { email, password } = loginDto;

    const grant = await this.grantService.issueGrant({ email, password });

    const keycloakUser = await this.grantService.getUserInfoFromToken(grant.access_token!);

    if (!keycloakUser) {
      throw new InternalServerErrorException('Cannot get user info from token');
    }

    //get user from db
    //if user doesnt exist in db throw internal server error so we know db isnt synced with keycloak
    const userInDb = await this.kysely
      .selectFrom('User')
      .where('email', '=', keycloakUser.email)
      .executeTakeFirst();

    if (!userInDb) {
      //TODO logger, need to know if this happens
      throw new InternalServerErrorException('User does not exist in database');
    }
    return {
      refreshToken: grant.refresh_token.token,
      accessToken: grant.access_token.token,
      expires: grant.expires_in
    };
  }

  async register(registerDto: LocalRegisterDto) {
    return 'register';
  }

  async logout() {
    return 'logout';
  }
}
