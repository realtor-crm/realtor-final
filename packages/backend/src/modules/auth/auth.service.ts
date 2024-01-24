import { Injectable, UnauthorizedException } from '@nestjs/common';
import { KeycloakAdminService } from '../keycloak/services/admin.service';
import { KeycloakGrantService } from '../keycloak/services/grant.service';

@Injectable()
export class AuthService {
  public constructor(
    private readonly adminService: KeycloakAdminService,
    private readonly grantService: KeycloakGrantService
  ) {}
  public logout(userId: string) {
    return this.adminService.logoutUser(userId);
  }

  public refresh(refreshToken: string | undefined) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    return this.grantService.issueGrantFromRefreshToken(refreshToken);
  }
}
