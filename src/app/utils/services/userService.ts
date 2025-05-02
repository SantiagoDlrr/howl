import axios from 'axios';

// Definimos los tipos aquí directamente para evitar problemas de importación
export type UserRole = 'consultant' | 'supervisor' | 'administrator';

export interface UserRoleData {
  userId: string;
  consultantId: string;
  role: UserRole;
}

export interface RoleResponse {
  userId: string;
  consultantId: string;
  role: UserRole;
}

export interface ErrorResponse {
  error: string;
  details?: string;
}

export const getUserRole = async (): Promise<RoleResponse> => {
  try {
    const response = await axios.get<RoleResponse>('/api/roles');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error((error.response.data as ErrorResponse).error);
    }
    throw new Error('Error al obtener el rol del usuario');
  }
};

export const isAdminOrSupervisor = (role: UserRole): boolean => {
  return role === 'administrator' || role === 'supervisor';
};