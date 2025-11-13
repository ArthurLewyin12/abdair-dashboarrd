import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { LoginCredentials } from "@/types/auth";

/**
 * Hook de mutation pour gérer la connexion de l'utilisateur.
 * Encapsule l'appel à l'API de login dans une mutation TanStack Query.
 *
 * @returns Une mutation que vous pouvez déclencher avec `mutate(payload)`.
 *          Expose des états comme `isPending`, `isError`, `isSuccess`.
 */
export const useLogin = () => {
  return useMutation({
    mutationFn: async (payload: LoginCredentials) => {
      return authService.login(payload);
    },
  });
};
