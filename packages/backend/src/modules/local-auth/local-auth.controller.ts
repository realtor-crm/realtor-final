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
import { jwtConfig } from '../config/jwt.config';
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
    const { expires = 0, refreshToken, accessToken } = await this.localAuthService.login(loginDto);

    const { rememberMe } = loginDto;

    const cookieOptions = {
      httpOnly: true,
      ...(rememberMe ? { maxAge: expires * 1000 } : {})
    };

    response.cookie(this.jwtConfiguration.cookieName, refreshToken, cookieOptions);

    return {
      accessToken
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
