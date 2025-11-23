/**
 * Statut d'une offre d'emploi
 */
export enum JobOfferStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  ARCHIVED = "ARCHIVED",
}

/**
 * Interface représentant une offre d'emploi (réponse du back-end)
 */
export interface JobOffer {
  id: number;
  titre: string;
  description: string;
  statut: JobOfferStatus;
  dateLimite: string | null; // ISO date string
  dateCreation: string; // ISO date string
  dateModification: string | null; // ISO date string
  utilisateurId: number;
  utilisateurNom: string;
  nombreCandidatures: number;
}

/**
 * Payload pour créer ou modifier une offre d'emploi
 */
export interface JobOfferRequest {
  titre: string;
  description: string;
  dateLimite?: string | null; // ISO date string, optionnel
}

/**
 * Réponse paginée pour les offres d'emploi
 */
export interface JobOfferPaginatedResponse {
  content: JobOffer[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // Page actuelle (0-indexed)
  first: boolean;
  last: boolean;
  empty: boolean;
}
