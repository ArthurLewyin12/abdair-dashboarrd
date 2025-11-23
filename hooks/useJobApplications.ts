import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobApplicationService } from "@/services/job-application.service";
import { createQueryKey } from "@/lib/request";
import { JobApplicationStatus } from "@/types/job-application";
import { toast } from "@/lib/toast";

/**
 * Hook pour récupérer toutes les candidatures reçues
 */
export const useMyReceivedApplications = () => {
  return useQuery({
    queryKey: createQueryKey("applications", "received"),
    queryFn: () => jobApplicationService.getMyReceivedApplications(),
  });
};

/**
 * Hook pour récupérer les candidatures d'une offre spécifique
 */
export const useApplicationsByJobOffer = (jobOfferId: number) => {
  return useQuery({
    queryKey: createQueryKey("applications", "job-offer", jobOfferId),
    queryFn: () => jobApplicationService.getApplicationsByJobOffer(jobOfferId),
    enabled: !!jobOfferId,
  });
};

/**
 * Hook pour récupérer une candidature par son ID
 */
export const useApplication = (id: number) => {
  return useQuery({
    queryKey: createQueryKey("applications", id),
    queryFn: () => jobApplicationService.getApplicationById(id),
    enabled: !!id,
  });
};

/**
 * Hook de mutation pour mettre à jour le statut d'une candidature
 */
export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: JobApplicationStatus }) =>
      jobApplicationService.updateApplicationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: createQueryKey("applications") });
      toast({
        variant: "default",
        title: "Statut mis à jour",
        message: "Le statut de la candidature a été mis à jour avec succès.",
      });
    },
    onError: () => {
      toast({
        variant: "error",
        title: "Erreur",
        message: "Une erreur est survenue lors de la mise à jour du statut.",
      });
    },
  });
};

/**
 * Hook de mutation pour supprimer une candidature
 */
export const useDeleteApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => jobApplicationService.deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: createQueryKey("applications") });
      toast({
        variant: "default",
        title: "Candidature supprimée",
        message: "La candidature a été supprimée avec succès.",
      });
    },
    onError: () => {
      toast({
        variant: "error",
        title: "Erreur",
        message: "Une erreur est survenue lors de la suppression de la candidature.",
      });
    },
  });
};
