import axios from 'axios';
import { CallLogEntry } from '../types/callLogTypes';

export const getCallLogs = async (): Promise<CallLogEntry[]> => {
  try {
    console.log("Obteniendo logs de llamadas...");
    const response = await axios.get<CallLogEntry[]>('/api/callLogs');
    console.log(`${response.data.length} logs de llamadas obtenidos`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo logs de llamadas:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch call logs');
    }
    throw new Error('Error obteniendo logs de llamadas');
  }
};

export const getSupervisedConsultants = async (supervisorId: number): Promise<number[]> => {
  try {
    console.log("Obteniendo consultores supervisados...");
    const response = await axios.get<{ consultants: number[] }>(`/api/supervision?supervisor_id=${supervisorId}`);
    console.log("Consultores supervisados:", response.data);
    return response.data.consultants || [];
  } catch (error) {
    console.error('Error obteniendo consultores supervisados:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch supervised consultants');
    }
    throw new Error('Error obteniendo consultores supervisados');
  }
};