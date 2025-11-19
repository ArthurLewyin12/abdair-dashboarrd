import ENVIRONNEMENTS from "@/constants/environnements";
import Cookies from "js-cookie";
import { RequestMiddleware } from "../types/request.middleware";

/**
 * Middleware pour ajouter l'en-tête d'autorisation (Authorization) aux requêtes sortantes.
 * Ce middleware récupère le token d'authentification depuis les cookies et, s'il existe,
 * l'ajoute à l'en-tête 'Authorization' avec le préfixe 'Bearer'.
 *
 * Les endpoints publics (login, register, refresh) sont exclus automatiquement.
 *
 * @param config La configuration de la requête en cours. Cet objet sera modifié pour y inclure l'en-tête.
 * @param next La fonction à appeler pour passer au middleware suivant dans la chaîne.
 * @returns Le résultat de l'appel au middleware suivant.
 */
export const requestHeaderMiddleware: RequestMiddleware = async (
  config,
  next,
) => {
  // Endpoints publics qui ne nécessitent pas de token
  const publicEndpoints = ['/auth/login', '/auth/register', '/auth/refresh'];

  // Vérifier si l'URL correspond à un endpoint public
  const isPublicEndpoint = publicEndpoints.some(endpoint =>
    config.url?.includes(endpoint)
  );

  // N'ajouter le token que si ce n'est pas un endpoint public
  if (!isPublicEndpoint) {
    const token = Cookies.get("token_" + ENVIRONNEMENTS.UNIVERSE);

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return next(config);
};
