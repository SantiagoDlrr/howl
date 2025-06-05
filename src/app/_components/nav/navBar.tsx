// nav/navbar.tsx
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import NavElement from "./navElement";
import { routes } from "@/app/utils/routes";
import LogoElement from "./logoElement";
import { useSession } from "next-auth/react";
import NavDropdown from "./navDropDown";
import Link from "next/link";

const NavBar = () => {
    const [selected, setSelected] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const logged = status === "authenticated";
    const isLandingPage = pathname === "/";

    // Scroll detection for landing page
    useEffect(() => {
        if (!isLandingPage) return;

        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isLandingPage]);

    // Dynamic classes based on landing page and scroll state
    const getNavbarClasses = () => {
        if (!isLandingPage) {
            // Normal pages - regular styling
            return "w-full flex justify-between items-center px-6 py-6 h-24 bg-white border-b border-gray-200 shadow-sm";
        }

        // Landing page - dynamic styling based on scroll
        if (isScrolled) {
            // Scrolled down - normal styling but sticky
            return "fixed top-0 z-50 w-full flex justify-between items-center px-6 py-6 h-24 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg transition-all duration-300";
        } else {
            // At top - transparent
            return "fixed top-0 z-50 w-full flex justify-between items-center px-6 py-6 h-24 bg-transparent transition-all duration-300";
        }
    };

    return (
        <nav className={`pt-16 pb-16 ${getNavbarClasses()}`}>
            {logged ? (
                <>
                    <Link href="/">
                        <LogoElement isLandingPage={isLandingPage} isScrolled={isScrolled} />
                    </Link>
                    
                    <div className={`flex items-center gap-4 rounded-full px-8 py-3 border transition-all duration-300 ${
                        isLandingPage && !isScrolled 
                            ? "bg-white/10 backdrop-blur-md border-white/20" 
                            : "bg-gray-50 border-gray-200 "
                    }`}>
                        {routes.map((route, index) => (
                            <NavElement 
                                id={route.id} 
                                key={index} 
                                href={route.href} 
                                label={route.label} 
                                isSelected={route.id === selected} 
                                setSelected={setSelected}
                                icon={route.icon}
                                isLandingPage={isLandingPage}
                                isScrolled={isScrolled}
                            />
                        ))}
                    </div>
                    
                    <NavDropdown session={session} isLandingPage={isLandingPage} isScrolled={isScrolled} />
                </>
            ) : (
                <Link href="/">
                    <LogoElement isLandingPage={isLandingPage} isScrolled={isScrolled} />
                </Link>
            )}
        </nav>
    );
};

export default NavBar;