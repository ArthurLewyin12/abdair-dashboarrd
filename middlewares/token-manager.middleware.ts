import ENVIRONNEMENTS from "@/constants/environnements";
import Cookies from "js-cookie";
import { ResponseMiddleware } from "./types/response.middleware";

/**
 * Middleware de réponse chargé de gérer les tokens d'authentification.
 * Il inspecte les en-têtes (`Authorization`, `RefreshToken`) et le corps de la réponse
 * pour trouver de nouveaux tokens et les stocke dans les cookies si présents.
 *
 * @param response L'objet de réponse Axios.
 * @param next La fonction pour passer au middleware suivant.
 * @returns Le résultat de l'appel au middleware suivant.
 */
export const tokenMiddleware: ResponseMiddleware = (response, next) => {
  let authHeader =
    response.headers["Authorization"] || response.headers["authorization"];
  let refreshTokenHeader =
    response.headers["RefreshToken"] || response.headers["refreshToken"];

  // Extraction depuis le corps de la réponse
  // Le back-end renvoie access_token et refresh_token directement à la racine
  if (response.data) {
    const responseData = response.data;
    if (responseData.access_token) {
      authHeader = responseData.access_token;
    }
    if (responseData.refresh_token) {
      refreshTokenHeader = responseData.refresh_token;
    }
  }

  if (authHeader) {
    Cookies.set("token_" + ENVIRONNEMENTS.UNIVERSE, authHeader);
  }
  if (refreshTokenHeader) {
    Cookies.set("refreshToken_" + ENVIRONNEMENTS.UNIVERSE, refreshTokenHeader);
  }

  return next(response);
};
