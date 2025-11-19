"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { Spinner } from "@/components/ui/spinner";

/**
 * Composant AuthGuard pour protéger les routes nécessitant une authentification.
 * Redirige automatiquement vers /login si l'utilisateur n'est pas connecté.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useSession();

  useEffect(() => {
    // Si on n'est pas en train de charger et qu'il n'y a pas d'utilisateur
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  // Afficher un spinner pendant le chargement de la session
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8" />
          <p className="text-sm text-muted-foreground">
            Vérification de la session...
          </p>
        </div>
      </div>
    );
  }

  // Si pas d'utilisateur, ne rien afficher (la redirection est en cours)
  if (!user) {
    return null;
  }

  // Si l'utilisateur est connecté, afficher le contenu
  return <>{children}</>;
}
