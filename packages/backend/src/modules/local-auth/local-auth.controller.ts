import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Res,
  UsePipes
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Response } from 'express';
import { Public } from 'nest-keycloak-connect';
import { ZodValidationPipe } from 'nestjs-zod';
import { jwtConfig } from '../../config/jwt/jwt.config';
import { LocalLoginDto } from './dtos/login.dto';
import { LocalRegisterDto } from './dtos/register.dto';
import { LocalAuthService } from './local-auth.service';

@Controller('auth/local')
export class LocalAuthController {
  constructor(
    private readonly localAuthService: LocalAuthService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
  ) {}
  @Post('login')
  @Public()
  @UsePipes(ZodValidationPipe)
  async login(
    @Body()
    loginDto: LocalLoginDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const {
      refresh_expires_in = 0,
      refresh_token,
      access_token
    } = await this.localAuthService.login(loginDto);

    const { rememberMe } = loginDto;

    const cookieOptions = {
      httpOnly: true,
      ...(rememberMe ? { maxAge: refresh_expires_in * 1000 } : {})
    };

    response.cookie(this.jwtConfiguration.cookieName, refresh_token, cookieOptions);

    return {
      access_token
    };
  }

  @Public()
  @Post('register')
  @UsePipes(ZodValidationPipe)
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: LocalRegisterDto) {
    return this.localAuthService.register(registerDto);
  }
}
