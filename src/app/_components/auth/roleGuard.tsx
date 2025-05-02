import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/server/auth';
import { getUserRole } from '@/services/userService';
import RestrictedAccess from './RestrictedAccess';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
}

const RoleGuard = async ({ children, allowedRoles }: RoleGuardProps) => {
  const session = await auth();

  if (!session?.user) {
    return <RestrictedAccess />;
  }

  try {
    const roleData = await getUserRole();
    
    if (!allowedRoles.includes(roleData.role)) {
      // Si el usuario no tiene un rol permitido, mostrar acceso restringido
      return <RestrictedAccess />;
    }
    
    // Si el usuario tiene un rol permitido, mostrar el contenido
    return <>{children}</>;
  } catch (error) {
    console.error('Error al verificar el rol:', error);
    return <RestrictedAccess />;
  }
};

export default RoleGuard;