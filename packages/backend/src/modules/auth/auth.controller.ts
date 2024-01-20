import { Controller, Post } from '@nestjs/common';
import { AuthenticatedUser } from 'nest-keycloak-connect';
import { KeycloakTokenParsed } from '../keycloak/types/grant.type';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('logout')
  async logout(@AuthenticatedUser() user: KeycloakTokenParsed) {
    return this.authService.logout(user.sub);
  }
}
