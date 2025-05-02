import axios from 'axios';
import { RoleResponse, ErrorResponse } from '@/types/userTypes';

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

export const isAdminOrSupervisor = (role: string): boolean => {
  return role === 'administrator' || role === 'supervisor';
};