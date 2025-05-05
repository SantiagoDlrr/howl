import { auth } from "@/server/auth";
import { getUserRoleFromDb } from "@/app/api/roles/utils";
import RestrictedAccess from "@/app/_components/auth/restrictedAccess";
import UserManagementTable from "@/app/_components/roles/roleManagementTable";

const Roles = async () => {
    // Verificar si el usuario está autenticado
    const session = await auth();
    
    if (!session?.user) {
      return <RestrictedAccess />;
    }
  
    try {
      // Obtener el rol del usuario
      const userRole = await getUserRoleFromDb(session.user.id);
      
      if (!userRole || userRole.role !== 'administrator') {
        // Solo los administradores pueden acceder a esta página
        return <RestrictedAccess />;
      }
      
      // Mostrar la página de gestión de usuarios
      return (
        <div className="container mx-auto py-8 px-4">
          <UserManagementTable />
        </div>
      );
    } catch (error) {
      console.error('Error al verificar rol del usuario:', error);
      
      return (
        <div className="container mx-auto py-8 px-4">
          <div className="p-4 bg-red-100 text-red-700 rounded">
            Error al verificar permisos. Por favor, intenta de nuevo más tarde.
          </div>
        </div>
      );
    }
  };
  
  export default Roles;