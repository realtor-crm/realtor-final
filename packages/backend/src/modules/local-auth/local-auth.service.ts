import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { TokenResponse } from '../auth/types/auth.types';
import { KeycloakAdminService } from '../keycloak/services/admin.service';
import { KeycloakGrantService } from '../keycloak/services/grant.service';
import { UserService } from '../user/user.service';
import { LocalLoginDto } from './dtos/login.dto';
import { LocalRegisterDto } from './dtos/register.dto';

@Injectable()
export class LocalAuthService {
  constructor(
    private readonly grantService: KeycloakGrantService,
    private readonly userService: UserService,
    private readonly adminService: KeycloakAdminService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger
  ) {}
  async login(loginDto: LocalLoginDto): Promise<
    TokenResponse & {
      refresh_expires_in: number | undefined;
    }
  > {
    const { email, password } = loginDto;

    const grant = await this.grantService.issueGrant({ email, password });

    const keycloakUser = await this.grantService.getUserInfoFromToken(grant.access_token!);

    if (!keycloakUser) {
      this.logger.error('Couldnt get userinfo from token for this user: ' + email);
      throw new InternalServerErrorException('Cannot get user info from token');
    }

    const userInDb = await this.userService.findUserByEmail(keycloakUser.email);
    if (!userInDb) {
      this.logger.error('Keycloak db and backend db wasnt synced for this user: ' + email);
      throw new InternalServerErrorException('User does not exist in database');
    }
    const { refresh_token, access_token } = grant;
    return {
      refresh_token: refresh_token.token,
      access_token: access_token.token,
      refresh_expires_in: refresh_token.content.exp
    };
  }

  public async register(registerDto: LocalRegisterDto) {
    return this.createUser(registerDto);
  }

  private async createUser(registerDto: LocalRegisterDto): Promise<{ message: string }> {
    const keycloakUser = await this.adminService.createKeycloakUser({
      registerDto,
      verifyEmail: true,
      activeProfile: true
    });

    if (!keycloakUser) {
      this.logger.error('Couldnt create user in keycloak for this user: ' + registerDto.email);
      throw new InternalServerErrorException('Cannot create user');
    }

    try {
      const userInDb = await this.userService.createUser(registerDto, keycloakUser.id);
      if (!userInDb) {
        this.logger.error('Couldnt create user in local db for this user: ' + registerDto.email);
        throw new InternalServerErrorException('Cannot create user');
      }
    } catch (error) {
      // If there's an error when creating the user in the local database,
      // delete the user from Keycloak to keep the two systems in sync.
      await this.adminService.deleteUserById(keycloakUser.id);
      throw error;
    }

    return {
      message: 'User created successfully'
    };
  }
}
