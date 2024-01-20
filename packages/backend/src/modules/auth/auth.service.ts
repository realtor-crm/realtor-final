import { Injectable } from '@nestjs/common';
import { KeycloakAdminService } from '../keycloak/services/admin.service';

@Injectable()
export class AuthService {
  public constructor(private readonly adminService: KeycloakAdminService) {}
  public async logout(userId: string) {
    return this.adminService.logoutUser(userId);
  }
}
