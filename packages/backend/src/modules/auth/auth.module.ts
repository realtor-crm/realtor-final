import { Module } from '@nestjs/common';
import { LocalAuthModule } from '../local-auth/local-auth.module';
import { SocialAuthModule } from '../social-auth/social-auth.module';
import { AuthService } from './auth.service';

@Module({
  imports: [LocalAuthModule, SocialAuthModule],
  exports: [LocalAuthModule, SocialAuthModule],
  providers: [AuthService]
})
export class AuthModule {}
