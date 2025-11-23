import { request } from "@/lib/request";
import { JobOfferEndpoints } from "@/constants/endpoint";
import {
  JobOffer,
  JobOfferRequest,
  JobOfferPaginatedResponse,
} from "@/types/job-offer";

export class JobOfferService {
  /**
   * Récupère toutes les offres d'emploi
   */
  async getAllJobOffers(): Promise<JobOffer[]> {
    return request.get<JobOffer[]>(JobOfferEndpoints.LIST);
  }

  /**
   * Récupère les offres d'emploi avec pagination
   * @param page - Numéro de page (0-indexed)
   * @param size - Nombre d'éléments par page
   */
  async getJobOffersPaginated(
    page: number = 0,
    size: number = 10,
  ): Promise<JobOfferPaginatedResponse> {
    return request.get<JobOfferPaginatedResponse>(
      `${JobOfferEndpoints.PAGINATED}?page=${page}&size=${size}`,
    );
  }

  /**
   * Récupère uniquement les offres ouvertes
   */
  async getOpenJobOffers(): Promise<JobOffer[]> {
    return request.get<JobOffer[]>(JobOfferEndpoints.OPEN);
  }

  /**
   * Récupère les offres créées par l'utilisateur connecté
   */
  async getMyJobOffers(): Promise<JobOffer[]> {
    return request.get<JobOffer[]>(JobOfferEndpoints.MY_OFFERS);
  }

  /**
   * Récupère une offre d'emploi par son ID
   */
  async getJobOfferById(id: number): Promise<JobOffer> {
    return request.get<JobOffer>(
      JobOfferEndpoints.DETAIL.replace(":id", String(id)),
    );
  }

  /**
   * Crée une nouvelle offre d'emploi
   */
  async createJobOffer(data: JobOfferRequest): Promise<JobOffer> {
    return request.post<JobOffer>(JobOfferEndpoints.CREATE, data);
  }

  /**
   * Met à jour une offre d'emploi existante
   */
  async updateJobOffer(id: number, data: JobOfferRequest): Promise<JobOffer> {
    return request.put<JobOffer>(
      JobOfferEndpoints.UPDATE.replace(":id", String(id)),
      data,
    );
  }

  /**
   * Ferme une offre d'emploi (change le statut à CLOSED)
   */
  async closeJobOffer(id: number): Promise<JobOffer> {
    return request.patch<JobOffer>(
      JobOfferEndpoints.CLOSE.replace(":id", String(id)),
    );
  }

  /**
   * Supprime une offre d'emploi
   */
  async deleteJobOffer(id: number): Promise<void> {
    return request.delete<void>(
      JobOfferEndpoints.DELETE.replace(":id", String(id)),
    );
  }
}

export const jobOfferService = new JobOfferService();
