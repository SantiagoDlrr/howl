"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  // Verificar si el usuario está autenticado
  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (status === "unauthenticated") {
    redirect("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-56 relative">
            <div className="absolute inset-0 opacity-10">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <defs>
                  <pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="2" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#pattern)" />
              </svg>
            </div>
            
            <div className="flex items-center h-full px-8">
              <div className="flex items-center space-x-6">
                <div className="relative ring-4 ring-white/30 rounded-full shadow-lg">
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={`Foto de ${session.user.name}`}
                      width={110}
                      height={110}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white/20">
                      <span className="text-3xl font-bold text-indigo-700">
                        {session?.user?.name?.charAt(0) || "U"}
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-green-500 border-2 border-white"></div>
                </div>
                <div className="text-white">
                  <h1 className="text-3xl font-bold tracking-tight">{session?.user?.name}</h1>
                  <p className="text-indigo-100 flex items-center mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-2">
                      <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                      <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                    </svg>
                    {session?.user?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Columna izquierda - Información personal */}
              <div className="lg:col-span-2">
                <div className="space-y-8">
                  {/* Tarjeta de información personal */}
                  <div>
                    <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-indigo-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                      </svg>
                      Información Personal
                    </h2>
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                      <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                        <div>
                          <dt className="text-sm text-gray-500 mb-1">Nombre</dt>
                          <dd className="text-gray-800 font-medium">{session?.user?.name || "No disponible"}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500 mb-1">Email</dt>
                          <dd className="text-gray-800 font-medium break-all">{session?.user?.email || "No disponible"}</dd>
                        </div>
                        <div className="md:col-span-2">
                          <dt className="text-sm text-gray-500 mb-1">ID de Usuario</dt>
                          <dd className="text-gray-800 font-mono text-sm break-all bg-gray-100 p-2 rounded">{session?.user?.id || "No disponible"}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  {/* Tarjeta de actividad reciente */}
                  <div>
                    <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-indigo-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Actividad reciente
                    </h2>
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 min-h-[150px] flex items-center justify-center">
                      <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mx-auto text-gray-300 mb-2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                        </svg>
                        <p className="text-gray-500">No hay actividad reciente para mostrar.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna derecha - Acciones */}
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-indigo-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                  Acciones
                </h2>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <div className="space-y-3">
                    <Link
                      href="/main"
                      className="flex items-center px-4 py-3 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition duration-200 w-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                      Ir a Llamadas
                    </Link>
                    
                    <button 
                      onClick={() => alert("Funcionalidad en desarrollo")}
                      className="flex items-center px-4 py-3 text-indigo-600 bg-white hover:bg-indigo-50 border border-indigo-200 rounded-lg transition duration-200 w-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                      Editar Perfil
                    </button>
                    
                    <button 
                      onClick={() => alert("Funcionalidad en desarrollo")}
                      className="flex items-center px-4 py-3 text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition duration-200 w-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                      Cambiar Contraseña
                    </button>
                    
                    <div className="border-t border-gray-200 my-3 pt-3">
                      <button 
                        onClick={() => alert("Funcionalidad en desarrollo")}
                        className="flex items-center px-4 py-3 text-red-600 bg-white hover:bg-red-50 border border-red-200 rounded-lg transition duration-200 w-full"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}