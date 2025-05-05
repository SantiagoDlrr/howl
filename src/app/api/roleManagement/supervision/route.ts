import { NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { auth } from '@/server/auth';
import { getUserRoleFromDb } from '@/app/api/roles/utils';

// Obtener consultores supervisados por un supervisor
export async function GET(request: Request) {
  try {
    // Verificar autorización
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    
    // Obtener role del usuario actual
    const userRole = await getUserRoleFromDb(session.user.id);
    
    if (!userRole) {
      return NextResponse.json(
        { error: "No se pudo determinar el rol del usuario" },
        { status: 403 }
      );
    }
    
    // Verificar que el acceso esté permitido (administrador o el propio supervisor)
    const url = new URL(request.url);
    const supervisorId = url.searchParams.get('supervisorId');
    
    if (!supervisorId) {
      return NextResponse.json(
        { error: "ID de supervisor no proporcionado" },
        { status: 400 }
      );
    }
    
    // Solo permitir a administradores o al mismo supervisor consultar
    const isOwnRecord = userRole.consultantId.toString() === supervisorId;
    
    if (userRole.role !== 'administrator' && !isOwnRecord) {
      return NextResponse.json(
        { error: "No tienes permiso para consultar estos datos" },
        { status: 403 }
      );
    }
    
    // Obtener los consultores supervisados
    const supervised = await query(
      `SELECT supervised_id 
       FROM supervision 
       WHERE supervisor_id = $1 AND supervised_id <> supervisor_id`,
      [supervisorId]
    );
    
    // Extraer solo los IDs
    const supervisedIds = supervised.map((s: any) => s.supervised_id);
    
    return NextResponse.json({ supervisedUsers: supervisedIds });
  } catch (error) {
    console.error('Error al obtener consultores supervisados:', error);
    return NextResponse.json(
      { error: "Error del servidor al obtener consultores supervisados" },
      { status: 500 }
    );
  }
}

// Actualizar las asignaciones de supervisión
export async function PUT(request: Request) {
  try {
    // Verificar autorización
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    
    // Obtener rol del usuario actual
    const userRole = await getUserRoleFromDb(session.user.id);
    
    if (!userRole || (userRole.role !== 'administrator' && userRole.role !== 'supervisor')) {
      return NextResponse.json(
        { error: "Solo administradores y supervisores pueden modificar supervisiones" },
        { status: 403 }
      );
    }
    
    // Obtener datos de la solicitud
    const data = await request.json();
    
    if (!data.supervisorId || !Array.isArray(data.supervisedIds)) {
      return NextResponse.json(
        { error: "Datos incompletos. Se requiere supervisorId y un array de supervisedIds." },
        { status: 400 }
      );
    }
    
    // Si no es administrador, verificar que esté modificando sus propias supervisiones
    if (userRole.role !== 'administrator' && userRole.consultantId !== data.supervisorId) {
      return NextResponse.json(
        { error: "Solo puedes modificar tus propias supervisiones" },
        { status: 403 }
      );
    }
    
    // Comenzar transacción
    await query('BEGIN');
    
    try {
      // 1. Eliminar supervisiones actuales (excepto la auto-referencia)
      await query(
        'DELETE FROM supervision WHERE supervisor_id = $1 AND supervised_id <> supervisor_id',
        [data.supervisorId]
      );
      
      // 2. Agregar nuevas supervisiones
      if (data.supervisedIds.length > 0) {
        for (const supervisedId of data.supervisedIds) {
          // Evitar la auto-referencia
          if (supervisedId !== data.supervisorId) {
            await query(
              'INSERT INTO supervision (supervisor_id, supervised_id) VALUES ($1, $2)',
              [data.supervisorId, supervisedId]
            );
          }
        }
      }
      
      await query('COMMIT');
      
      return NextResponse.json({ success: true });
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error al actualizar supervisiones:', error);
    return NextResponse.json(
      { error: `Error del servidor: ${error instanceof Error ? error.message : 'Error desconocido'}` },
      { status: 500 }
    );
  }
}