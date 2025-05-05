// Tipos de roles disponibles
export type AccessLevel = 'consultant' | 'supervisor' | 'administrator' | 'unassigned';

// Estructura para representar un usuario en la tabla
export interface UserTableData {
  id: string;           // ID de usuario de la tabla User
  consultantId?: number; // ID de consultor si existe
  firstName: string;    
  lastName: string;
  email: string;
  accessLevel: AccessLevel;
  supervisedUsers?: number[]; // IDs de los consultores supervisados (solo para supervisores)
}

// Estructura para actualizar un usuario
export interface UserUpdateData {
  userId: string;
  consultantId?: number;
  accessLevel: AccessLevel;
  supervisedUsers?: number[];
}

// Estructura para datos de supervisión
export interface SupervisionData {
  supervisorId: number;
  supervisedId: number;
}