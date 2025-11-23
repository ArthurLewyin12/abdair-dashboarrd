/**
 * Statut d'une candidature
 */
export enum JobApplicationStatus {
  PENDING = "PENDING",
  REVIEWED = "REVIEWED",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

/**
 * Interface représentant une candidature (réponse du back-end)
 */
export interface JobApplication {
  id: number;
  prenom: string;
  nom: string;
  email: string;
  numeroTelephone: string;
  cvUrl: string;
  nomFichierCv: string;
  message: string | null;
  jobOfferId: number;
  jobOfferTitre: string;
  statut: JobApplicationStatus;
  dateCreation: string; // ISO date string
  dateExamen: string | null; // ISO date string
}

/**
 * Payload pour créer une candidature (utilisé côté public)
 */
export interface JobApplicationRequest {
  prenom: string;
  nom: string;
  email: string;
  numeroTelephone: string;
  message?: string;
  jobOfferId: number;
  cv: File;
}

/**
 * Payload pour mettre à jour le statut d'une candidature
 */
export interface UpdateApplicationStatusRequest {
  status: JobApplicationStatus;
}
