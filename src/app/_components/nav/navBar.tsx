// nav/navbar.tsx
"use client";

import { useState } from "react";
import NavElement from "./navElement";
import { routes } from "@/app/utils/routes";
import LogoElement from "./logoElement";
import { useSession } from "next-auth/react";
import NavDropdown from "./navDropDown";
import Link from "next/link";

const NavBar = () => {
    const [selected, setSelected] = useState(0);
    const { data: session, status } = useSession();
    const logged = status === "authenticated";

    return (
        <nav className="w-full flex justify-between items-center px-6 py-4 h-20 bg-white border-b border-gray-200 shadow-sm">
            {logged ? (
                <>
                    <Link href="/">
                        <LogoElement />
                    </Link>
                    
                    <div className="flex items-center gap-3 bg-gray-50 rounded-full px-6 py-2 border border-gray-200">
                        {routes.map((route, index) => (
                            <NavElement 
                                id={route.id} 
                                key={index} 
                                href={route.href} 
                                label={route.label} 
                                isSelected={route.id === selected} 
                                setSelected={setSelected}
                                icon={route.icon}
                            />
                        ))}
                    </div>
                    
                    <NavDropdown session={session} />
                </>
            ) : (
                <Link href="/">
                    <LogoElement />
                </Link>
            )}
        </nav>
    );
};

export default NavBar;
