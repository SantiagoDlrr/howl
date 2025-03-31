"use client";
import { useState, useRef, useEffect } from "react";
import { Session } from "next-auth";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const NavDropdown = ({ session }: { session: Session }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className="relative inline-block">
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
                        <button onClick={() => router.push("/profile")} className="w-full text-left">
                            Ver perfil
                        </button>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        <button onClick={() => signOut()} className="w-full text-left">
                            Sign Out
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default NavDropdown;
