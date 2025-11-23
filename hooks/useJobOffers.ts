import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobOfferService } from "@/services/job-offer.service";
import { createQueryKey } from "@/lib/request";
import { JobOfferRequest } from "@/types/job-offer";
import { toast } from "@/lib/toast";

/**
 * Hook pour récupérer toutes les offres d'emploi
 */
export const useJobOffers = () => {
  return useQuery({
    queryKey: createQueryKey("job-offers"),
    queryFn: () => jobOfferService.getAllJobOffers(),
  });
};

/**
 * Hook pour récupérer les offres d'emploi avec pagination
 */
export const useJobOffersPaginated = (page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: createQueryKey("job-offers", "paginated", { page, size }),
    queryFn: () => jobOfferService.getJobOffersPaginated(page, size),
  });
};

/**
 * Hook pour récupérer uniquement les offres ouvertes
 */
export const useOpenJobOffers = () => {
  return useQuery({
    queryKey: createQueryKey("job-offers", "open"),
    queryFn: () => jobOfferService.getOpenJobOffers(),
  });
};

/**
 * Hook pour récupérer les offres de l'utilisateur connecté
 */
export const useMyJobOffers = () => {
  return useQuery({
    queryKey: createQueryKey("job-offers", "my"),
    queryFn: () => jobOfferService.getMyJobOffers(),
  });
};

/**
 * Hook pour récupérer une offre par son ID
 */
export const useJobOffer = (id: number) => {
  return useQuery({
    queryKey: createQueryKey("job-offers", id),
    queryFn: () => jobOfferService.getJobOfferById(id),
    enabled: !!id,
  });
};

/**
 * Hook de mutation pour créer une offre d'emploi
 */
export const useCreateJobOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: JobOfferRequest) =>
      jobOfferService.createJobOffer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: createQueryKey("job-offers") });
      toast({
        variant: "default",
        title: "Offre créée",
        message: "L'offre d'emploi a été créée avec succès.",
      });
    },
    onError: () => {
      toast({
        variant: "error",
        title: "Erreur",
        message: "Une erreur est survenue lors de la création de l'offre.",
      });
    },
  });
};

/**
 * Hook de mutation pour mettre à jour une offre d'emploi
 */
export const useUpdateJobOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: JobOfferRequest }) =>
      jobOfferService.updateJobOffer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: createQueryKey("job-offers") });
      toast({
        variant: "default",
        title: "Offre mise à jour",
        message: "L'offre d'emploi a été mise à jour avec succès.",
      });
    },
    onError: () => {
      toast({
        variant: "error",
        title: "Erreur",
        message: "Une erreur est survenue lors de la mise à jour de l'offre.",
      });
    },
  });
};

/**
 * Hook de mutation pour fermer une offre d'emploi
 */
export const useCloseJobOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => jobOfferService.closeJobOffer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: createQueryKey("job-offers") });
      toast({
        variant: "default",
        title: "Offre fermée",
        message: "L'offre d'emploi a été fermée avec succès.",
      });
    },
    onError: () => {
      toast({
        variant: "error",
        title: "Erreur",
        message: "Une erreur est survenue lors de la fermeture de l'offre.",
      });
    },
  });
};

/**
 * Hook de mutation pour supprimer une offre d'emploi
 */
export const useDeleteJobOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => jobOfferService.deleteJobOffer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: createQueryKey("job-offers") });
      toast({
        variant: "default",
        title: "Offre supprimée",
        message: "L'offre d'emploi a été supprimée avec succès.",
      });
    },
    onError: () => {
      toast({
        variant: "error",
        title: "Erreur",
        message: "Une erreur est survenue lors de la suppression de l'offre.",
      });
    },
  });
};
