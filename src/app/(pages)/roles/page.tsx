import { auth } from "@/server/auth";
import RoleGuard from "@/app/_components/auth/RoleGuard";

const Roles = async () => {
    const session = await auth();
    
    if (!session?.user) {
        return null; // El RoleGuard manejará la redirección
    }
    
    return (
        <RoleGuard allowedRoles={['supervisor', 'administrator']}>
            <div className="flex flex-col justify-center items-center pt-20">
                <h1 className="text-2xl font-bold mb-4">Administración de Roles</h1>
                <p>Esta página solo es visible para supervisores y administradores.</p>
                
                {/* Aquí puedes agregar el contenido específico de la página de roles */}
            </div>
        </RoleGuard>
    );
};

export default Roles;