/**
 * Endpoints relatifs à l'authentification des utilisateurs.
 * Nota: La baseURL est déjà configurée avec "/api/v1" dans request.ts
 * Donc ces endpoints sont relatifs à cette base.
 */
export enum AuthEndpoints {
  LOGIN = "/auth/login",
  AUTH_ME = "/auth/me",
  LOGOUT = "/auth/logout",
  PASSWORD_RESET = "/auth/password/reset",
  RESET_LINK = "/auth/password/email",
  REFRESH_TOKEN = "/auth/refresh",
}
