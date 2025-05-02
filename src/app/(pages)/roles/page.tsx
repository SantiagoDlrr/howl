import { auth } from "@/server/auth";
import { getUserRole, isAdminOrSupervisor } from "@/app/utils/services/userService";
import RestrictedAccess from "@/app/_components/auth/restrictedAccess";

const Roles = async () => {
    const session = await auth();
    
    if (!session?.user) {
        return <RestrictedAccess />;
    }

    try {
        // Obtener el rol del usuario
        const roleData = await getUserRole();
        
        // Verificar si el usuario es administrador o supervisor
        if (!isAdminOrSupervisor(roleData.role)) {
            return <RestrictedAccess />;
        }
        
        // Si el usuario tiene el rol adecuado, mostrar el contenido de la página
        return (
            <div className="flex flex-col justify-center items-center pt-20">
                <h1 className="text-2xl font-bold mb-4">Administración de Roles</h1>
                <p>Esta página solo es visible para supervisores y administradores.</p>
                
            </div>
        );
    } catch (error) {
        console.error('Error al verificar el rol:', error);
        return <RestrictedAccess />;
    }
};

export default Roles;