export interface ContactMessage {
  id: number;
  nom: string;
  email: string;
  numeroTelephone: string | null;
  sujet: string;
  message: string;
  type: MessageType;
  statut: MessageStatus;
  dateCreation: string;
  dateLecture: string | null;
  dateReponse: string | null;
}

export interface ContactMessageRequest {
  nom: string;
  email: string;
  numeroTelephone?: string;
  sujet: string;
  message: string;
  type?: MessageType;
}

export enum MessageType {
  QUOTE = "QUOTE",
  INFO = "INFO",
  OTHER = "OTHER",
}

export enum MessageStatus {
  NEW = "NEW",
  READ = "READ",
  REPLIED = "REPLIED",
  ARCHIVED = "ARCHIVED",
}

export interface ContactMessagePaginatedResponse {
  content: ContactMessage[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
