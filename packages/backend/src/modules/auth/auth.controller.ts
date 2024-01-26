import { Controller, Inject, Post, Req, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import { AuthenticatedUser, Public } from 'nest-keycloak-connect';
import { jwtConfig } from '../config/jwt.config';
import { KeycloakTokenParsed } from '../keycloak/types/grant.type';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
  ) {}

  @Post('logout')
  async logout(@AuthenticatedUser() user: KeycloakTokenParsed) {
    return this.authService.logout(user.sub);
  }

  @Post('refresh')
  @Public()
  async refresh(@Req() request: Request) {
    const refreshToken = request.cookies?.[this.jwtConfiguration.cookieName];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    return this.authService.refresh(refreshToken);
  }
}
