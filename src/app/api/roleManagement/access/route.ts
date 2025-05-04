import { NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { auth } from '@/server/auth';
import { getUserRoleFromDb } from '@/app/api/roles/utils';
import { UserTableData, UserUpdateData } from '@/app/utils/types/roleManagementType';

// Actualizar el nivel de acceso de un usuario
export async function PUT(request: Request) {
  try {
    // Verificar autorización (solo administradores pueden modificar roles)
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
        { error: "Acceso denegado. Solo administradores pueden modificar roles." },
        { status: 403 }
      );
    }
    
    // Obtener datos de la solicitud
    const updateData: UserUpdateData = await request.json();
    
    // Validar los datos recibidos
    if (!updateData.userId || !updateData.accessLevel) {
      return NextResponse.json(
        { error: "Datos incompletos. Se requiere userId y accessLevel." },
        { status: 400 }
      );
    }
    
    // Comenzar transacción para actualizar roles
    await query('BEGIN');
    
    try {
      // 1. Verificar si el usuario existe
      const userExists = await query(
        'SELECT id, email, name FROM "User" WHERE id = $1',
        [updateData.userId]
      );
      
      if (userExists.length === 0) {
        throw new Error('Usuario no encontrado');
      }
      
      const user = userExists[0];
      
      // 2. Determinar si ya existe un registro de consultor para este usuario
      let consultantId = updateData.consultantId;
      
      if (!consultantId) {
        const consultantCheck = await query(
          'SELECT id FROM consultant WHERE user_id = $1',
          [updateData.userId]
        );
        
        if (consultantCheck.length > 0) {
          consultantId = consultantCheck[0].id;
        }
      }
      
      // 3. Si el nuevo rol no es "unassigned", asegurarse de que exista un registro de consultor
      if (updateData.accessLevel !== 'unassigned') {
        if (!consultantId) {
          // Crear nuevo registro de consultor
          const nameparts = user.name?.split(' ') || ['', ''];
          const firstName = nameparts[0] || '';
          const lastName = nameparts.slice(1).join(' ') || '';
          
          const newConsultant = await query(
            'INSERT INTO consultant (firstname, lastname, email, user_id) VALUES ($1, $2, $3, $4) RETURNING id',
            [firstName, lastName, user.email, updateData.userId]
          );
          
          consultantId = newConsultant[0].id;
        }
        
        // 4. Eliminar roles anteriores para este consultor
        await query('DELETE FROM administration WHERE administrator_id = $1 AND administrated_id = 22', [consultantId]);
        await query('DELETE FROM supervision WHERE supervisor_id = $1', [consultantId]);
        
        // 5. Asignar nuevo rol
        if (updateData.accessLevel === 'administrator') {
          await query(
            'INSERT INTO administration (administrator_id, administrated_id) VALUES ($1, $2)',
            [consultantId, 22] // Asignamos el administrated_id por defecto como 22
          );
        } else if (updateData.accessLevel === 'supervisor') {
          await query(
            'INSERT INTO supervision (supervisor_id, supervised_id) VALUES ($1, $1)',
            [consultantId]
          );
          
          // Si hay usuarios supervisados, agregarlos
          if (updateData.supervisedUsers && updateData.supervisedUsers.length > 0) {
            for (const supervisedId of updateData.supervisedUsers) {
              if (supervisedId !== consultantId) {
                await query(
                  'INSERT INTO supervision (supervisor_id, supervised_id) VALUES ($1, $2)',
                  [consultantId, supervisedId]
                );
              }
            }
          }
        }
      } else if (consultantId) {
        // Si el nuevo rol es "unassigned", eliminar todos los roles y opcionalmente el consultor
        await query('DELETE FROM administration WHERE administrator_id = $1', [consultantId]);
        await query('DELETE FROM supervision WHERE supervisor_id = $1', [consultantId]);
        // Opcionalmente: await query('DELETE FROM consultant WHERE id = $1', [consultantId]);
      }
      
      await query('COMMIT');
      
      // Construir respuesta
      const userData: UserTableData = {
        id: updateData.userId,
        consultantId: consultantId,
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email,
        accessLevel: updateData.accessLevel,
        supervisedUsers: updateData.supervisedUsers
      };
      
      return NextResponse.json(userData);
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error al actualizar acceso de usuario:', error);
    return NextResponse.json(
      { error: `Error del servidor: ${error instanceof Error ? error.message : 'Error desconocido'}` },
      { status: 500 }
    );
  }
}