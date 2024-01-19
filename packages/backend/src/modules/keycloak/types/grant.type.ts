import { Grant, Token } from 'keycloak-connect';

type KeycloakResourceAccess = {
  [key: string]: KeycloakRoles;
};

type KeycloakRoles = {
  roles: string[];
};

export type KeycloakTokenParsed = KeycloakProfile & {
  exp?: number;
  iat?: number;
  auth_time?: number;
  jti?: string;
  iss?: string;
  sub: string;
  typ?: string;
  azp?: string;
  acr?: string;
  session_state?: string;
  'allowed-origins': string[];
  realm_access?: KeycloakRoles;
  resource_access?: KeycloakResourceAccess;
  scope?: string;
};
type KeycloakProfile = {
  name?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  email_verified?: string;
  preferred_username?: string;
};

export type GuaranteedToken = Token & {
  token: string;
  content: KeycloakTokenParsed;
};

export type GuaranteedGrant = Grant & {
  access_token: GuaranteedToken;
  refresh_token: GuaranteedToken;
};
