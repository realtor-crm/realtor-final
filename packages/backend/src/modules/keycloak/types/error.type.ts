export interface KeycloakError extends Error {
  response?: {
    status?: number;
    data?: any;
  };
}
