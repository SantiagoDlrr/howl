import { auth } from '@/server/auth';
import { NextResponse } from 'next/server';
import { getUserRoleFromDb } from './utils';

// Asegúrate de que esta función esté exportada como GET
export async function GET(_request: Request) {
  try {
    console.log("Iniciando proceso de obtención de rol...");
    
    // Obtener la sesión del usuario autenticado
    const session = await auth();
    console.log("Sesión obtenida:", JSON.stringify(session, null, 2));

    if (!session?.user?.id) {
      console.log("Usuario no autenticado o ID no disponible", { session });
      return NextResponse.json(
        { error: "Usuario no autenticado o ID no disponible" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    console.log("ID de usuario:", userId);

    // Usar la función de utilidad para obtener el rol
    const userData = await getUserRoleFromDb(userId);

    if (!userData) {
      return NextResponse.json({ error: "No se pudo determinar el rol del usuario" }, { status: 404 });
    }
    
    console.log("Datos de usuario a devolver:", userData);
    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error detallado al obtener rol de usuario:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}