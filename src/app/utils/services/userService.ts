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

export const getUserRole = async (): Promise<UserRoleData> => {
  try {
    // Usar la API fetch nativa en lugar de axios para simplificar
    const apiUrl = '/api/roles';
    console.log('Iniciando petición para obtener rol del usuario en URL:', apiUrl);
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Respuesta recibida:', data);
    return data;
  } catch (error) {
    console.error('Error obteniendo rol del usuario:', error);
    throw error;
  }
}

export const isAdminOrSupervisor = (role: UserRole): boolean => {
  return role === 'administrator' || role === 'supervisor';
};