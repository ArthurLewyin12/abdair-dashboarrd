export interface Service {
  id: number;
  titre: string;
  description: string;
  imageUrl: string | null;
  actif: boolean;
  dateCreation: string;
  dateModification: string | null;
}

export interface ServiceRequest {
  titre: string;
  description: string;
  actif?: boolean;
}

export interface ServiceFormData extends ServiceRequest {
  image?: File;
}
