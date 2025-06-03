"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserRole } from '@/app/utils/services/userService';
import type { UserRoleData } from '@/app/utils/services/userService';
import AIProviderSettings from '../../_components/settings/AIProviderSettings';
import Spinner from '@/app/_components/spinner';

export default function AI() {
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

  // Mostrar error si algo salió mal
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

  // Mostrar la página de configuración AI
  return (
    <div className="container mx-auto py-8 px-4">

      {/* Contenido principal */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-8 text-center"></h1>
        <AIProviderSettings />
      </div>

      {/* Botón de navegación adicional si lo necesitas */}
      {/* <div className="flex justify-center mt-8">
        <button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            router.push('/main');
          }}
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors mr-4"
        >
          Volver al inicio
        </button>
        <button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            router.back();
          }}
          className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition-colors"
        >
          Atrás
        </button>
      </div> */}
    </div>
  );
}