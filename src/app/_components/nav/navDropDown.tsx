// nav/navDropDown.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import type { Session } from "next-auth";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/app/utils/services/userService";
import type { UserRoleData } from "@/app/utils/services/userService";

interface NavDropdownProps {
    session: Session;
    isLandingPage?: boolean;
    isScrolled?: boolean;
}

const NavDropdown = ({ session, isLandingPage = false, isScrolled = false }: NavDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [userRole, setUserRole] = useState<UserRoleData | null>(null);
    const [isLoadingRole, setIsLoadingRole] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

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

    const isAdmin = userRole?.role === 'administrator';

    const handleNavigation = (path: string) => {
        setIsOpen(false);
        router.push(path);
    };

    // Estilos dinámicos para el botón
    const getButtonClasses = () => {
        const baseClasses = "flex items-center gap-3 px-5 py-3 rounded-full border transition-all duration-300 hover:scale-105";
        
        if (isLandingPage && !isScrolled) {
            return `${baseClasses} bg-[#B351FF]/10 backdrop-blur-md border-[#B351FF]/20 text-white hover:bg-[#B351FF]/20`;
        } else {
            return `${baseClasses} bg-gray-100 border-gray-200 text-gray-700 hover:bg-[#B351FF]/10 hover:text-[#B351FF]`;
        }
    };

    // Estilos dinámicos para el menú desplegable
    const getDropdownClasses = () => {
        const baseClasses = "absolute right-0 mt-3 w-56 border rounded-2xl shadow-2xl transition-all duration-300 ease-out";
        
        if (isLandingPage && !isScrolled) {
            return `${baseClasses} bg-[#B351FF]/20 backdrop-blur-xl border-[#B351FF]/30`;
        } else {
            return `${baseClasses} bg-white border-gray-200`;
        }
    };

    // Estilos dinámicos para los botones del menú
    const getMenuButtonClasses = (isSignOut = false) => {        const baseClasses = "w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3";
        
        if (isLandingPage && !isScrolled) {
            if (isSignOut) {
                return `${baseClasses} text-red-200 hover:bg-red-400/20`;
            } else {
                return `${baseClasses} text-white hover:bg-white/20`;
            }
        } else {
            if (isSignOut) {
                return `${baseClasses} text-red-600 hover:bg-red-50`;
            } else {
                return `${baseClasses} text-gray-700 hover:bg-purple-50`;
            }
        }
    };

    return (
        <div ref={dropdownRef} className="relative inline-block z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={getButtonClasses()}
            >
                {session.user?.image && (
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#B351FF]/30 transition-all duration-300">
                        <Image 
                            src={session.user.image} 
                            alt="User Image" 
                            width={32} 
                            height={32} 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                )}
                <span className="text-sm font-medium max-w-24 truncate">
                    {session?.user?.name}
                </span>
                <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <div
                className={`${getDropdownClasses()} ${
                    isOpen 
                        ? "opacity-100 scale-100 translate-y-0" 
                        : "opacity-0 scale-95 translate-y-[-10px] pointer-events-none"
                }`}
            >
                <div className="p-2">
                    <button 
                        onClick={() => handleNavigation("/profile")} 
                        className={getMenuButtonClasses()}
                    >
                        <div className="w-8 h-8 bg-gradient-to-br from-[#B351FF] to-[#9d44e8] rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <span className="font-medium">Ver perfil</span>
                    </button>
                    
                    {!isLoadingRole && isAdmin && (
                        <>
                            <div className={`h-px mx-2 my-2 ${
                                isLandingPage && !isScrolled ? 'bg-white/30' : 'bg-gray-200'
                            }`}></div>
                            
                            <button 
                                onClick={() => handleNavigation("/roles")} 
                                className={getMenuButtonClasses()}
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                </div>
                                <span className="font-medium">Gestión de Roles</span>
                            </button>
                            
                            <button 
                                onClick={() => handleNavigation("/clients")} 
                                className={getMenuButtonClasses()}
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <span className="font-medium">Clientes</span>
                            </button>

                            <button 
                                onClick={() => handleNavigation("/ai")} 
                                className={getMenuButtonClasses()}
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <span className="font-medium">Inteligencia Artificial</span>
                            </button>
                        </>
                    )}
                    
                    <div className={`h-px mx-2 my-2 ${
                        isLandingPage && !isScrolled ? 'bg-white/30' : 'bg-gray-200'
                    }`}></div>
                    
                    <button 
                        onClick={() => signOut({ callbackUrl: '/auth' })} 
                        className={getMenuButtonClasses(true)}
                    >
                        <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </div>
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NavDropdown;

