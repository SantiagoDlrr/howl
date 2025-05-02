import { query } from '@/lib/database';
import { auth } from '@/server/auth';
import { NextResponse } from 'next/server';
import { UserRoleData, ErrorResponse, UserRole } from '@/app/utils/services/userService';

export async function GET(_request: Request) {
  try {
    console.log("Iniciando proceso de obtención de rol...");
    
    // Obtener la sesión del usuario autenticado
    const session = await auth();
    console.log("Sesión obtenida:", JSON.stringify(session, null, 2));

    if (!session?.user?.id) {
      console.log("Usuario no autenticado o ID no disponible", { session });
      return NextResponse.json(
        { error: "Usuario no autenticado o ID no disponible" } as ErrorResponse,
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // First, get the consultant.id that matches the user_id
    const consultantResult = await query<{ id: string }>(
      `SELECT id FROM consultant WHERE user_id = $1`,
      [userId]
    );

    if (consultantResult.length === 0) {
      return NextResponse.json(
        { error: "Consultant not found for this user" } as ErrorResponse, 
        { status: 404 }
      );
    }

    const consultantId = consultantResult[0]?.id;

    if (!consultantId) {
      return NextResponse.json(
        { error: "Consultant ID not found" } as ErrorResponse, 
        { status: 404 }
      );
    }

    // Check roles based on consultantId
    const isAdmin = await query(
      `SELECT 1 FROM administration WHERE administrator_id = $1`,
      [consultantId]
    );

    const isSupervisor = await query(
      `SELECT 1 FROM supervision WHERE supervisor_id = $1`,
      [consultantId]
    );

    let role: UserRole = "consultant";
    if (isAdmin.length > 0) role = "administrator";
    else if (isSupervisor.length > 0) role = "supervisor";    

    const userData: UserRoleData = { userId, consultantId, role };
    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error detallado al obtener rol de usuario:", error);
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: error instanceof Error ? error.message : String(error) 
    } as ErrorResponse, { status: 500 });
  }
}