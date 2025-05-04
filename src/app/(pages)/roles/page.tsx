import { auth } from "@/server/auth";
import { getUserRoleFromDb, isAdminOrSupervisor } from "@/app/api/roles/utils";
import RestrictedAccess from "@/app/_components/auth/restrictedAccess";

const Roles = async () => {
    const session = await auth();
    
    if (!session?.user) {
        return <RestrictedAccess />;
    }

    try {
        console.log('Intentando obtener rol del usuario directamente de la DB...');
        
        // Obtener el userId de la sesión
        const userId = session.user.id;
        
        if (!userId) {
            console.error("No se encontró userId en la sesión");
            return <RestrictedAccess />;
        }
        
        // Obtener el rol directamente de la base de datos
        const roleData = await getUserRoleFromDb(userId);
        
        if (!roleData) {
            console.error("No se pudo obtener información de rol para el usuario");
            return <RestrictedAccess />;
        }
        
        console.log('Rol obtenido:', roleData);
        
        // Verificar si el usuario es administrador o supervisor
        if (!isAdminOrSupervisor(roleData.role)) {
            console.log('Usuario no tiene permisos, rol actual:', roleData.role);
            return <RestrictedAccess />;
        }
        
        // Si el usuario tiene el rol adecuado, mostrar el contenido de la página
        return (
            <div className="flex flex-col justify-center items-center pt-20">
                <h1 className="text-2xl font-bold mb-4">Administración de Roles</h1>
                <p className="mb-4">Esta página solo es visible para supervisores y administradores.</p>
                <div className="p-4 bg-green-100 rounded-md border border-green-300">
                    <p className="text-green-800">Tu rol actual: <span className="font-bold">{roleData.role}</span></p>
                    <p className="text-green-800">ID de consultor: {roleData.consultantId}</p>
                </div>                
            </div>
        );
    } catch (error) {
        console.error('Error al verificar el rol:', error);
        return (
            <div className="flex flex-col justify-center items-center pt-20">
                <div className="p-6 bg-red-100 rounded-md border border-red-300 max-w-md">
                    <h2 className="text-xl font-bold text-red-800 mb-2">Error de acceso</h2>
                    <p className="text-red-700 mb-4">
                        No se pudo verificar tu rol de usuario. Por favor, intenta de nuevo más tarde.
                    </p>
                    <p className="text-sm text-red-600 font-mono overflow-auto max-h-40">
                        {error instanceof Error ? error.message : 'Error desconocido'}
                    </p>
                </div>
            </div>
        );
    }
};

export default Roles;