// app/roles/page.tsx
"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserRole } from '@/app/utils/services/userService';
import type { UserRoleData } from '@/app/utils/services/userService';
import UserManagementTable from "@/app/_components/roles/roleManagementTable";
import Spinner from '@/app/_components/spinner';

const Roles = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRoleData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        setLoading(true);
        console.log("Verificando rol de usuario...");
        
        // Obtener el rol del usuario usando el servicio
        const roleData = await getUserRole();
        console.log("Rol obtenido:", roleData);
        
        setUserRole(roleData);
        
        // Verificar si el usuario es administrador
        if (roleData.role !== 'administrator') {
          console.log("Usuario no es administrador, redirigiendo...");
          // Redirigir o mostrar mensaje de acceso denegado
          setError('Acceso denegado. Solo los administradores pueden acceder a esta página.');
        }
      } catch (err) {
        console.error('Error al verificar rol:', err);
        setError(err instanceof Error ? err.message : 'Error al verificar permisos');
      } finally {
        setLoading(false);
      }
    };

    void checkUserRole();
  }, []);

  // Mostrar spinner mientras carga
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  // Mostrar error o acceso denegado
  if (error || !userRole || userRole.role !== 'administrator') {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-bg-dark">
        <h1 className="text-2xl font-bold mb-4">Acceso Denegado</h1>
        <p className="text-lg mb-4">
          {error || 'Solo los administradores pueden acceder a esta página.'}
        </p>
        <button 
          onClick={() => router.push('/main')}
          className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  // Mostrar la página de gestión de usuarios
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Indicador de rol (opcional) */}
      <div className="bg-blue-50 p-3 rounded-md mb-4">
        <span className="font-semibold">Rol actual:</span> Administrador
        <span className="ml-2 text-gray-500">
          (Tienes acceso completo para gestionar usuarios)
        </span>
      </div>
      
      <UserManagementTable />
    </div>
  );
};

export default Roles;