import { NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { auth } from '@/server/auth';
import { getUserRoleFromDb, isAdminOrSupervisor } from '@/app/api/roles/utils';
import { AccessLevel, UserTableData } from '@/app/utils/types/roleManagementType';

// Obtener todos los usuarios con sus roles
export async function GET(request: Request) {
  try {
    // Verificar autorización (solo administradores pueden ver todos los usuarios)
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    
    // Obtener rol del usuario actual
    const userRole = await getUserRoleFromDb(session.user.id);
    
    if (!userRole || userRole.role !== 'administrator') {
      return NextResponse.json(
        { error: "Acceso denegado. Solo administradores pueden gestionar usuarios." },
        { status: 403 }
      );
    }
    
    // Obtener todos los usuarios de la base de datos
    const usersQuery = `
      SELECT 
        u.id, 
        u.name, 
        u.email,
        c.id as consultant_id,
        c.firstname,
        c.lastname
      FROM 
        "User" u
      LEFT JOIN 
        consultant c ON u.id = c.user_id
    `;
    
    const users = await query(usersQuery);
    
    // Para cada usuario, determinar su nivel de acceso
    const usersWithRoles: UserTableData[] = await Promise.all(
      users.map(async (user: any) => {
        let accessLevel: AccessLevel = 'unassigned';
        
        if (user.consultant_id) {
          // Verificar si es administrador
          const adminCheck = await query(
            `SELECT 1 FROM administration WHERE administrator_id = $1`,
            [user.consultant_id]
          );
          
          if (adminCheck.length > 0) {
            accessLevel = 'administrator';
          } else {
            // Verificar si es supervisor
            const supervisorCheck = await query(
              `SELECT 1 FROM supervision WHERE supervisor_id = $1`,
              [user.consultant_id]
            );
            
            if (supervisorCheck.length > 0) {
              accessLevel = 'supervisor';
            } else {
              accessLevel = 'consultant';
            }
          }
        }
        
        return {
          id: user.id,
          consultantId: user.consultant_id,
          firstName: user.firstname || user.name?.split(' ')[0] || '',
          lastName: user.lastname || user.name?.split(' ')[1] || '',
          email: user.email,
          accessLevel
        } as UserTableData;
      })
    );
    
    return NextResponse.json(usersWithRoles);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json(
      { error: "Error del servidor al obtener usuarios" },
      { status: 500 }
    );
  }
}