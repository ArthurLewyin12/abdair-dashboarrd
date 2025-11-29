import { request } from "@/lib/request";
import { ContactMessageEndpoints } from "@/constants/endpoint";
import {
  ContactMessage,
  ContactMessageRequest,
  MessageStatus,
} from "@/types/contact-message";

export class ContactMessageService {
  /**
   * Récupère tous les messages de contact
   */
  async getAllContactMessages(): Promise<ContactMessage[]> {
    return request.get<ContactMessage[]>(ContactMessageEndpoints.LIST);
  }

  /**
   * Récupère uniquement les nouveaux messages non lus
   */
  async getNewContactMessages(): Promise<ContactMessage[]> {
    return request.get<ContactMessage[]>(ContactMessageEndpoints.NEW);
  }

  /**
   * Récupère un message de contact par son ID
   */
  async getContactMessageById(id: number): Promise<ContactMessage> {
    return request.get<ContactMessage>(
      ContactMessageEndpoints.DETAIL.replace(":id", String(id)),
    );
  }

  /**
   * Crée un nouveau message de contact (endpoint public)
   */
  async createContactMessage(
    data: ContactMessageRequest,
  ): Promise<ContactMessage> {
    return request.post<ContactMessage>(ContactMessageEndpoints.CREATE, data);
  }

  /**
   * Met à jour le statut d'un message de contact
   */
  async updateContactMessageStatus(
    id: number,
    status: MessageStatus,
  ): Promise<ContactMessage> {
    return request.patch<ContactMessage>(
      `${ContactMessageEndpoints.UPDATE_STATUS.replace(":id", String(id))}?status=${status}`,
    );
  }

  /**
   * Supprime un message de contact
   */
  async deleteContactMessage(id: number): Promise<void> {
    return request.delete<void>(
      ContactMessageEndpoints.DELETE.replace(":id", String(id)),
    );
  }
}

export const contactMessageService = new ContactMessageService();
