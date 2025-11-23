import { request } from "@/lib/request";
import { ServiceEndpoints } from "@/constants/endpoint";
import { Service, ServiceFormData } from "@/types/service";

export class ServiceService {
  /**
   * Récupère tous les services
   */
  async getAllServices(): Promise<Service[]> {
    return request.get<Service[]>(ServiceEndpoints.LIST);
  }

  /**
   * Récupère les services avec pagination
   */
  async getServicesPaginated(
    page: number = 0,
    size: number = 10,
  ): Promise<{
    content: Service[];
    totalElements: number;
    totalPages: number;
    number: number;
  }> {
    return request.get(ServiceEndpoints.PAGINATED, {
      params: { page, size },
    });
  }

  /**
   * Récupère uniquement les services actifs
   */
  async getActiveServices(): Promise<Service[]> {
    return request.get<Service[]>(ServiceEndpoints.ACTIVE);
  }

  /**
   * Récupère un service par son ID
   */
  async getServiceById(id: number): Promise<Service> {
    const url = ServiceEndpoints.DETAIL.replace(":id", id.toString());
    return request.get<Service>(url);
  }

  /**
   * Crée un nouveau service avec image optionnelle
   */
  async createService(data: ServiceFormData): Promise<Service> {
    const formData: Record<string, any> = {
      titre: data.titre,
      description: data.description,
      actif: data.actif ?? true,
    };

    if (data.image) {
      formData.image = data.image;
    }

    return request.postFormData<Service>(ServiceEndpoints.CREATE, formData);
  }

  /**
   * Met à jour un service existant avec image optionnelle
   */
  async updateService(id: number, data: ServiceFormData): Promise<Service> {
    const url = ServiceEndpoints.UPDATE.replace(":id", id.toString());

    const formData: Record<string, any> = {
      titre: data.titre,
      description: data.description,
    };

    if (data.actif !== undefined) {
      formData.actif = data.actif;
    }

    if (data.image) {
      formData.image = data.image;
    }

    return request.postFormData<Service>(url, formData);
  }

  /**
   * Upload/Remplace l'image d'un service
   */
  async uploadImage(id: number, image: File): Promise<Service> {
    const url = ServiceEndpoints.UPLOAD_IMAGE.replace(":id", id.toString());
    return request.postFormData<Service>(url, { image });
  }

  /**
   * Active/Désactive un service
   */
  async toggleServiceStatus(id: number): Promise<Service> {
    const url = ServiceEndpoints.TOGGLE_STATUS.replace(":id", id.toString());
    return request.patch<Service>(url);
  }

  /**
   * Supprime un service
   */
  async deleteService(id: number): Promise<void> {
    const url = ServiceEndpoints.DELETE.replace(":id", id.toString());
    return request.delete(url);
  }
}

export const serviceService = new ServiceService();
