export type UserRole = 'administrator' | 'supervisor' | 'consultant';

export interface UserRoleData {
  userId: string;
  consultantId: number;
  role: UserRole;
}