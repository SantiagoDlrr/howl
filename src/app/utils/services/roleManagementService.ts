import axios from 'axios';
import { UserTableData, UserUpdateData, SupervisionData, AccessLevel } from '../types/roleManagementType';

/**
 * Obtiene todos los usuarios con sus niveles de acceso
 */
export const getAllUsers = async (): Promise<UserTableData[]> => {
  try {
    const response = await axios.get<UserTableData[]>('/api/roleManagement/users');
    return response.data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Error al obtener usuarios');
    }
    throw new Error('Error al obtener usuarios');
  }
};

/**
 * Obtiene los consultores supervisados por un supervisor
 */
export const getSupervisedUsers = async (supervisorId: number): Promise<number[]> => {
  try {
    const response = await axios.get<{supervisedUsers: number[]}>(`/api/roleManagement/supervision?supervisorId=${supervisorId}`);
    return response.data.supervisedUsers;
  } catch (error) {
    console.error('Error al obtener usuarios supervisados:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Error al obtener usuarios supervisados');
    }
    throw new Error('Error al obtener usuarios supervisados');
  }
};

/**
 * Actualiza el nivel de acceso de un usuario
 */
export const updateUserAccess = async (updateData: UserUpdateData): Promise<UserTableData> => {
  try {
    const response = await axios.put<UserTableData>('/api/roleManagement/access', updateData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar acceso de usuario:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Error al actualizar acceso de usuario');
    }
    throw new Error('Error al actualizar acceso de usuario');
  }
};

/**
 * Actualiza las asignaciones de supervisión
 */
export const updateSupervisionAssignments = async (
  supervisorId: number, 
  supervisedIds: number[]
): Promise<{success: boolean}> => {
  try {
    const response = await axios.put<{success: boolean}>('/api/roleManagement/supervision', {
      supervisorId,
      supervisedIds
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar supervisiones:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Error al actualizar supervisiones');
    }
    throw new Error('Error al actualizar supervisiones');
  }
};

/**
 * Verifica si un usuario tiene autorización para gestionar usuarios
 * (debe ser administrador)
 */
export const checkManagementAuthorization = async (): Promise<boolean> => {
  try {
    const response = await axios.get<{authorized: boolean}>('/api/roleManagement/authorization');
    return response.data.authorized;
  } catch (error) {
    console.error('Error al verificar autorización:', error);
    return false;
  }
};