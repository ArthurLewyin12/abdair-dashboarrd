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

/**
 * Endpoints relatifs à la gestion des offres d'emploi.
 */
export enum JobOfferEndpoints {
  LIST = "/job-offers",
  DETAIL = "/job-offers/:id",
  OPEN = "/job-offers/open",
  PAGINATED = "/job-offers/paginated",
  MY_OFFERS = "/job-offers/my-offers",
  CREATE = "/job-offers",
  UPDATE = "/job-offers/:id",
  DELETE = "/job-offers/:id",
  CLOSE = "/job-offers/:id/close",
}

/**
 * Endpoints relatifs à la gestion des candidatures.
 */
export enum JobApplicationEndpoints {
  CREATE = "/applications",
  DETAIL = "/applications/:id",
  BY_JOB_OFFER = "/applications/job-offer/:jobOfferId",
  MY_RECEIVED = "/applications/my-received",
  UPDATE_STATUS = "/applications/:id/status",
  DELETE = "/applications/:id",
}

/**
 * Endpoints relatifs à la gestion des services/prestations.
 */
export enum ServiceEndpoints {
  LIST = "/services",
  PAGINATED = "/services/paginated",
  ACTIVE = "/services/active",
  DETAIL = "/services/:id",
  CREATE = "/services",
  UPDATE = "/services/:id",
  UPLOAD_IMAGE = "/services/:id/image",
  TOGGLE_STATUS = "/services/:id/toggle-status",
  DELETE = "/services/:id",
}

/**
 * Endpoints relatifs à la gestion des messages de contact.
 */
export enum ContactMessageEndpoints {
  LIST = "/contact",
  DETAIL = "/contact/:id",
  NEW = "/contact/new",
  CREATE = "/contact",
  UPDATE_STATUS = "/contact/:id/status",
  DELETE = "/contact/:id",
}
