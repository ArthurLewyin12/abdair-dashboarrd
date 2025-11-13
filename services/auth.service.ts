import { AuthResponse, LoginCredentials } from "@/types/auth";
import { request } from "@/lib/request";
import { AuthEndpoints } from "@/constants/endpoint";

export class AuthService {
  /**
   * Connexion d'un utilisateur
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return request.post<AuthResponse>(AuthEndpoints.LOGIN, credentials);
  }

  /**
   * Deconnexion d'un utilisateur
   */
  async logout(): Promise<any> {
    return request.post<any>(AuthEndpoints.LOGOUT);
  }

  /**
   * Rafraichir le token d'authentification
   */
  async refreshToken(refreshToken: string): Promise<any> {
    return request.post<any>(AuthEndpoints.REFRESH_TOKEN, {
      refresh_token: refreshToken,
    });
  }

  /**
   * Recuperer les informations de l'utilisateur connecté
   */
  async getMe(): Promise<any> {
    return request.get<any>(AuthEndpoints.AUTH_ME);
  }
}

export const authService = new AuthService();
