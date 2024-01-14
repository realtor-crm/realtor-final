import { Injectable } from '@nestjs/common';
import { TokenResponse } from '../auth/types/auth.types';
import { LocalLoginDto } from './dtos/login.dto';
import { LocalRegisterDto } from './dtos/register.dto';

@Injectable()
export class LocalAuthService {
  async login(loginDto: LocalLoginDto): Promise<TokenResponse> {
    return {
      expires: '3600',
      accessToken: 'testing',
      refreshToken: 'testing'
    };
  }

  async register(registerDto: LocalRegisterDto) {
    return 'register';
  }

  async logout() {
    return 'logout';
  }
}
