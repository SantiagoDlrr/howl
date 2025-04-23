// src/app/api/supervision/route.ts
import { query } from '@/lib/database';
import { auth } from '@/server/auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    console.log("Iniciando obtención de supervisados...");
    
    // Verificar autenticación
    const session = await auth();
    if (!session?.user?.id) {
      console.log("Usuario no autenticado");
      return NextResponse.json(
        { error: "Usuario no autenticado" },
        { status: 401 }
      );
    }

    // Obtener parámetros de la URL
    const { searchParams } = new URL(request.url);
    const supervisorId = searchParams.get('supervisor_id');
    console.log("supervisor_id solicitado:", supervisorId);

    if (!supervisorId) {
      return NextResponse.json(
        { error: "supervisor_id es requerido" },
        { status: 400 }
      );
    }

    // Verificar que el usuario sea supervisor o administrador
    const roleResult = await query(
      `SELECT 1 FROM supervision WHERE supervisor_id = $1 
       UNION 
       SELECT 1 FROM administration WHERE administrator_id = $1`,
      [supervisorId]
    );
    console.log("Resultado verificación de rol:", roleResult);

    if (roleResult.length === 0) {
      console.log("No autorizado para ver esta información");
      return NextResponse.json(
        { error: "No autorizado para ver esta información" },
        { status: 403 }
      );
    }

    // Obtener los consultores supervisados
    console.log("Consultando consultores supervisados...");
    const supervisedConsultants = await query(
      `SELECT supervised_id AS consultant_id FROM supervision 
       WHERE supervisor_id = $1`,
      [supervisorId]
    );
    console.log("Consultores supervisados:", supervisedConsultants);

    // Extraer solo los IDs de consultores
    const consultants = supervisedConsultants.map(item => item.consultant_id);
    console.log("IDs de consultores:", consultants);

    return NextResponse.json({ consultants });
  } catch (error) {
    console.error("Error al obtener consultores supervisados:", error);
    return NextResponse.json(
      { error: "Error del servidor interno", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}