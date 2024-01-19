import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TokenResponse } from '../auth/types/auth.types';
import { KeycloakAdminService } from '../keycloak/services/admin.service';
import { KeycloakGrantService } from '../keycloak/services/grant.service';
import { UserService } from '../user/user.service';
import { LocalLoginDto } from './dtos/login.dto';
import { LocalRegisterDto } from './dtos/register.dto';

//TODO hide error messages from user and add logging using winston

@Injectable()
export class LocalAuthService {
  constructor(
    private readonly grantService: KeycloakGrantService,
    private readonly userService: UserService,
    private readonly adminService: KeycloakAdminService
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
    const userInDb = await this.userService.findUserByEmail(keycloakUser.email);
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

  public async register(registerDto: LocalRegisterDto) {
    return this.createUser(registerDto);
  }

  private async createUser(registerDto: LocalRegisterDto) {
    const keycloakUser = await this.adminService.createKeycloakUser({
      registerDto,
      verifyEmail: true,
      activeProfile: true
    });

    //TODO logger, need to know if this happens
    if (!keycloakUser) {
      throw new InternalServerErrorException('Cannot create user in keycloak');
    }
    return keycloakUser;
  }

  public async logout() {
    return 'logout';
  }
}
