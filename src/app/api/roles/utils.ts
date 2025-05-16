import type { UserRole, UserRoleData } from '@/app/utils/services/userService';
import { query } from '@/lib/database';

export async function getUserRoleFromDb(userId: string): Promise<UserRoleData | null> {
  try {
    console.log("Obteniendo rol desde la base de datos para userId:", userId);
    
    // Primero, obtener el consultant.id que corresponde al user_id
    const consultantResult = await query<{ id: number }>(
      `SELECT id FROM consultant WHERE user_id = $1`,
      [userId]
    );
    
    if (consultantResult.length === 0) {
      console.log("Consultor no encontrado para este usuario");
      return null;
    }
    
    const consultantId = consultantResult[0]?.id;
    
    if (!consultantId) {
      console.log("ID de consultor no encontrado");
      return null;
    }
    
    // Verificar roles basados en consultantId
    const isAdmin = await query(
      `SELECT 1 FROM administration WHERE administrator_id = $1`,
      [consultantId]
    );
    
    const isSupervisor = await query(
      `SELECT 1 FROM supervision WHERE supervisor_id = $1`,
      [consultantId]
    );
    
    // Asignar el rol como UserRole explícitamente
    let role: UserRole = "consultant";
    if (isAdmin.length > 0) role = "administrator";
    else if (isSupervisor.length > 0) role = "supervisor";
    
    return { userId, consultantId: consultantId.toString(), role };
  } catch (error) {
    console.error("Error al obtener rol desde DB:", error);
    return null;
  }
}

/**
 * Verifica si un usuario tiene rol de administrador o supervisor
 */
export function isAdminOrSupervisor(role: UserRole): boolean {
  return role === "administrator" || role === "supervisor";
}