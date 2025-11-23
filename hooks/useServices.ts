import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { serviceService } from "@/services/service.service";
import { createQueryKey } from "@/lib/request";
import { ServiceFormData } from "@/types/service";
import { toast } from "@/lib/toast";

/**
 * Hook pour récupérer tous les services
 */
export const useServices = () => {
  return useQuery({
    queryKey: createQueryKey("services"),
    queryFn: () => serviceService.getAllServices(),
  });
};

/**
 * Hook pour récupérer les services avec pagination
 */
export const useServicesPaginated = (page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: createQueryKey("services", "paginated", { page, size }),
    queryFn: () => serviceService.getServicesPaginated(page, size),
  });
};

/**
 * Hook pour récupérer uniquement les services actifs
 */
export const useActiveServices = () => {
  return useQuery({
    queryKey: createQueryKey("services", "active"),
    queryFn: () => serviceService.getActiveServices(),
  });
};

/**
 * Hook pour récupérer un service par son ID
 */
export const useService = (id: number) => {
  return useQuery({
    queryKey: createQueryKey("services", id),
    queryFn: () => serviceService.getServiceById(id),
    enabled: !!id,
  });
};

/**
 * Hook de mutation pour créer un service
 */
export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ServiceFormData) => serviceService.createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: createQueryKey("services") });
      toast({
        variant: "default",
        title: "Service créé",
        message: "Le service a été créé avec succès.",
      });
    },
    onError: () => {
      toast({
        variant: "error",
        title: "Erreur",
        message: "Une erreur est survenue lors de la création du service.",
      });
    },
  });
};

/**
 * Hook de mutation pour mettre à jour un service
 */
export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ServiceFormData }) =>
      serviceService.updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: createQueryKey("services") });
      toast({
        variant: "default",
        title: "Service mis à jour",
        message: "Le service a été mis à jour avec succès.",
      });
    },
    onError: () => {
      toast({
        variant: "error",
        title: "Erreur",
        message: "Une erreur est survenue lors de la mise à jour du service.",
      });
    },
  });
};

/**
 * Hook de mutation pour uploader une image
 */
export const useUploadServiceImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, image }: { id: number; image: File }) =>
      serviceService.uploadImage(id, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: createQueryKey("services") });
      toast({
        variant: "default",
        title: "Image uploadée",
        message: "L'image du service a été uploadée avec succès.",
      });
    },
    onError: () => {
      toast({
        variant: "error",
        title: "Erreur",
        message: "Une erreur est survenue lors de l'upload de l'image.",
      });
    },
  });
};

/**
 * Hook de mutation pour activer/désactiver un service
 */
export const useToggleServiceStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => serviceService.toggleServiceStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: createQueryKey("services") });
      toast({
        variant: "default",
        title: "Statut modifié",
        message: "Le statut du service a été modifié avec succès.",
      });
    },
    onError: () => {
      toast({
        variant: "error",
        title: "Erreur",
        message:
          "Une erreur est survenue lors de la modification du statut du service.",
      });
    },
  });
};

/**
 * Hook de mutation pour supprimer un service
 */
export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => serviceService.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: createQueryKey("services") });
      toast({
        variant: "default",
        title: "Service supprimé",
        message: "Le service a été supprimé avec succès.",
      });
    },
    onError: () => {
      toast({
        variant: "error",
        title: "Erreur",
        message: "Une erreur est survenue lors de la suppression du service.",
      });
    },
  });
};
