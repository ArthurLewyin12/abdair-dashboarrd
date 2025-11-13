/**
 * Endpoints relatifs à l'authentification des utilisateurs.
 */
export enum AuthEndpoints {
  LOGIN = "/auth/login",
  AUTH_ME = "/api/auth/me",
  LOGOUT = "/api/auth/logout",
  PASSWORD_RESET = "/api/auth/password/reset",
  RESET_LINK = "api/auth/password/email",
  REFRESH_TOKEN = "/api/auth/refresh-token",
}
