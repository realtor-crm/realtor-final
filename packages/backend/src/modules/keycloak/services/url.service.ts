import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { keycloakConfig } from '../../../config';

@Injectable()
export class KeycloakUrlService {
  constructor(
    @Inject(keycloakConfig.KEY)
    private readonly keycloakConfiguration: ConfigType<typeof keycloakConfig>
  ) {}

  private getOpenIdConnectUrl(): string {
    const { serverUrl, realm } = this.keycloakConfiguration;
    return `${serverUrl}/realms/${realm}/protocol/openid-connect`;
  }

  public getTokenUrl(): string {
    return `${this.getOpenIdConnectUrl()}/token`;
  }

  public getLogoutUrl(): string {
    return `${this.getOpenIdConnectUrl()}/logout`;
  }

  public getRequestSecrets(): { client_id: string; client_secret: string } {
    const { clientId, clientSecret } = this.keycloakConfiguration;
    return { client_id: clientId, client_secret: clientSecret };
  }
}
