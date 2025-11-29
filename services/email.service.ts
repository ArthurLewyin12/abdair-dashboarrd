import { request } from "@/lib/request";

export interface SendEmailRequest {
  to: string;
  subject: string;
  body: string;
  contactMessageId?: number;
}

export interface SendEmailResponse {
  to: string;
  subject: string;
  sentAt: string;
  success: boolean;
  message: string;
}

export class EmailService {
  /**
   * Envoie un email
   */
  async sendEmail(data: SendEmailRequest): Promise<SendEmailResponse> {
    return request.post<SendEmailResponse>("/emails/send", data);
  }
}

export const emailService = new EmailService();
