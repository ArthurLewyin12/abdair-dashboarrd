import { request } from "@/lib/request";
import { JobApplicationEndpoints } from "@/constants/endpoint";
import { JobApplication, JobApplicationStatus } from "@/types/job-application";

export class JobApplicationService {
  /**
   * Récupère toutes les candidatures reçues pour les offres de l'utilisateur connecté
   */
  async getMyReceivedApplications(): Promise<JobApplication[]> {
    return request.get<JobApplication[]>(JobApplicationEndpoints.MY_RECEIVED);
  }

  /**
   * Récupère toutes les candidatures pour une offre d'emploi spécifique
   */
  async getApplicationsByJobOffer(
    jobOfferId: number,
  ): Promise<JobApplication[]> {
    return request.get<JobApplication[]>(
      JobApplicationEndpoints.BY_JOB_OFFER.replace(
        ":jobOfferId",
        String(jobOfferId),
      ),
    );
  }

  /**
   * Récupère une candidature par son ID
   */
  async getApplicationById(id: number): Promise<JobApplication> {
    return request.get<JobApplication>(
      JobApplicationEndpoints.DETAIL.replace(":id", String(id)),
    );
  }

  /**
   * Met à jour le statut d'une candidature
   */
  async updateApplicationStatus(
    id: number,
    status: JobApplicationStatus,
  ): Promise<JobApplication> {
    return request.patch<JobApplication>(
      `${JobApplicationEndpoints.UPDATE_STATUS.replace(":id", String(id))}?status=${status}`,
    );
  }

  /**
   * Supprime une candidature
   */
  async deleteApplication(id: number): Promise<void> {
    return request.delete<void>(
      JobApplicationEndpoints.DELETE.replace(":id", String(id)),
    );
  }
}

export const jobApplicationService = new JobApplicationService();
