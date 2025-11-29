import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contactMessageService } from "@/services/contact-message.service";
import { createQueryKey } from "@/lib/request";
import { MessageStatus } from "@/types/contact-message";
import { toast } from "@/lib/toast";

/**
 * Hook pour récupérer tous les messages de contact
 */
export const useContactMessages = () => {
  return useQuery({
    queryKey: createQueryKey("contact-messages"),
    queryFn: () => contactMessageService.getAllContactMessages(),
  });
};

/**
 * Hook pour récupérer uniquement les nouveaux messages non lus
 */
export const useNewContactMessages = () => {
  return useQuery({
    queryKey: createQueryKey("contact-messages", "new"),
    queryFn: () => contactMessageService.getNewContactMessages(),
  });
};

/**
 * Hook pour récupérer un message de contact par son ID
 */
export const useContactMessage = (id: number) => {
  return useQuery({
    queryKey: createQueryKey("contact-messages", id),
    queryFn: () => contactMessageService.getContactMessageById(id),
    enabled: !!id,
  });
};

/**
 * Hook de mutation pour mettre à jour le statut d'un message
 */
export const useUpdateContactMessageStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: MessageStatus }) =>
      contactMessageService.updateContactMessageStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: createQueryKey("contact-messages"),
      });
      toast({
        variant: "default",
        title: "Statut mis à jour",
        message: "Le statut du message a été mis à jour avec succès.",
      });
    },
    onError: () => {
      toast({
        variant: "error",
        title: "Erreur",
        message:
          "Une erreur est survenue lors de la mise à jour du statut du message.",
      });
    },
  });
};

/**
 * Hook de mutation pour supprimer un message de contact
 */
export const useDeleteContactMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => contactMessageService.deleteContactMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: createQueryKey("contact-messages"),
      });
      toast({
        variant: "default",
        title: "Message supprimé",
        message: "Le message de contact a été supprimé avec succès.",
      });
    },
    onError: () => {
      toast({
        variant: "error",
        title: "Erreur",
        message: "Une erreur est survenue lors de la suppression du message.",
      });
    },
  });
};
