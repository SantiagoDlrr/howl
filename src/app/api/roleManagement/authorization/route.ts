import { NextResponse } from 'next/server';
import { auth } from '@/server/auth';
import { getUserRoleFromDb } from '@/app/api/roles/utils';

// Verificar si el usuario actual tiene autorización para gestionar usuarios
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ authorized: false });
    }
    
    const userRole = await getUserRoleFromDb(session.user.id);
    
    // Solo los administradores pueden gestionar usuarios
    const isAuthorized = userRole?.role === 'administrator';
    
    return NextResponse.json({ authorized: isAuthorized });
  } catch (error) {
    console.error('Error al verificar autorización:', error);
    return NextResponse.json(
      { error: "Error del servidor al verificar autorización", authorized: false },
      { status: 500 }
    );
  }
}