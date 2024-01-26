import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { KeycloakGrantService } from '../keycloak/services/grant.service';
import { TokenResponse } from './types/auth.types';

@Injectable()
export class AuthService {
  public constructor(private readonly grantService: KeycloakGrantService) {}
  public logout(userId: string) {}

  public refresh(refreshToken: string): Observable<TokenResponse> {
    return this.grantService.issueGrantFromRefreshToken(refreshToken);
  }
}
