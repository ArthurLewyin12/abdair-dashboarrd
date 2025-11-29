import { useMutation, useQueryClient } from "@tanstack/react-query";
import { emailService, SendEmailRequest } from "@/services/email.service";
import { createQueryKey } from "@/lib/request";
import { toast } from "@/lib/toast";

/**
 * Hook de mutation pour envoyer un email
 */
export const useSendEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendEmailRequest) => emailService.sendEmail(data),
    onSuccess: () => {
      // Invalider le cache des messages de contact car le statut a changé
      queryClient.invalidateQueries({
        queryKey: createQueryKey("contact-messages"),
      });
      toast({
        variant: "default",
        title: "Email envoyé",
        message: "L'email a été envoyé avec succès.",
      });
    },
    onError: () => {
      toast({
        variant: "error",
        title: "Erreur",
        message: "Une erreur est survenue lors de l'envoi de l'email.",
      });
    },
  });
};
