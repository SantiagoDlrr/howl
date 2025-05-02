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