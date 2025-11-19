import { User } from "./user";

export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Réponse d'authentification du back-end.
 * Les champs de token sont directement à la racine (pas dans un objet nested).
 */
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}
