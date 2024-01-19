import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { Public } from 'nest-keycloak-connect';
import { ZodValidationPipe } from 'nestjs-zod';
import { LocalLoginDto } from './dtos/login.dto';
import { LocalRegisterDto } from './dtos/register.dto';
import { LocalAuthService } from './local-auth.service';

@Controller('auth/local')
export class LocalAuthController {
  constructor(private readonly localAuthService: LocalAuthService) {}
  @Post('login')
  @Public()
  @UsePipes(ZodValidationPipe)
  async login(
    @Body()
    loginDto: LocalLoginDto
  ) {
    return this.localAuthService.login(loginDto);
  }

  @Public()
  @Post('register')
  @UsePipes(ZodValidationPipe)
  async register(@Body() registerDto: LocalRegisterDto) {
    return this.localAuthService.register(registerDto);
  }

  @Post('logout')
  async logout() {
    return 'logout';
  }
}
