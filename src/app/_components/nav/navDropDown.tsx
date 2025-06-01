"use client";
import { useState, useRef, useEffect } from "react";
import type { Session } from "next-auth";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/app/utils/services/userService";
import type { UserRoleData } from "@/app/utils/services/userService";

const NavDropdown = ({ session }: { session: Session }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [userRole, setUserRole] = useState<UserRoleData | null>(null);
    const [isLoadingRole, setIsLoadingRole] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Obtener el rol del usuario al cargar el componente
    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                setIsLoadingRole(true);
                const role = await getUserRole();
                setUserRole(role);
            } catch (error) {
                console.error('Error al obtener rol del usuario:', error);
                setUserRole(null);
            } finally {
                setIsLoadingRole(false);
            }
        };

        if (session?.user) {
            fetchUserRole();
        }
    }, [session]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Verificar si el usuario es administrador
    const isAdmin = userRole?.role === 'administrator';

    const handleNavigation = (path: string) => {
        setIsOpen(false);
        router.push(path);
    };

    return (
        <div ref={dropdownRef} className="relative inline-block z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-2 py-1 rounded-md hover:bg-bg-dark"
            >
                <div className="flex flex-row items-center">
                    {session.user?.image && (
                        <div>
                            <Image src={session.user.image} alt="User Image" width={40} height={40} className="rounded-full" />
                        </div>
                    )}
                    {session?.user?.name}
                </div>
            </button>

            <div
                className={`absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg transition-all duration-200 ease-in-out ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                    }`}
            >
                <ul className="py-2">
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        <button 
                            onClick={() => handleNavigation("/profile")} 
                            className="w-full text-left"
                        >
                            Ver perfil
                        </button>
                    </li>
                    
                    {/* Mostrar opciones de administrador solo si el usuario es admin */}
                    {!isLoadingRole && isAdmin && (
                        <>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                <button 
                                    onClick={() => handleNavigation("/roles")} 
                                    className="w-full text-left"
                                >
                                    Gestión de Roles
                                </button>
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                <button 
                                    onClick={() => handleNavigation("/clients")} 
                                    className="w-full text-left"
                                >
                                    Clientes
                                </button>
                            </li>

                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                <button 
                                    onClick={() => handleNavigation("/ai")} 
                                    className="w-full text-left"
                                >
                                    Inteligencia Artificial
                                </button>
                            </li>

                        </>
                    )}
                    
                    {/* Separador visual si hay opciones de admin */}
                    {!isLoadingRole && isAdmin && (
                        <li className="border-t border-gray-200 my-1"></li>
                    )}
                    
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        <button 
                            onClick={() => signOut({ callbackUrl: '/auth' })} 
                            className="w-full text-left"
                        >
                            Sign Out
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default NavDropdown;