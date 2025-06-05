// nav/navElement.tsx
"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface NavElementProps {
    id: number;
    label: string;
    isSelected: boolean;
    href: string;
    icon?: LucideIcon;
    setSelected: (key: number) => void;
    isLandingPage?: boolean;
    isScrolled?: boolean;
}

const NavElement = ({ label, isSelected, href, setSelected, id, icon: Icon, isLandingPage = false, isScrolled = false }: NavElementProps) => {
    const getButtonClasses = () => {
        const baseClasses = "group flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-medium transition-all duration-300 ease-out hover:scale-105 min-w-36";
        
        if (isLandingPage && !isScrolled) {
            // Transparent navbar on landing page
            if (isSelected) {
                return `${baseClasses} bg-white/30 text-white shadow-lg backdrop-blur-md`;
            } else {
                return `${baseClasses} bg-white/5 text-white/80 hover:bg-white/20 hover:text-white backdrop-blur-md`;
            }
        } else {
            // Normal navbar or scrolled state
            if (isSelected) {
                return `${baseClasses} bg-[#B351FF] text-white shadow-lg`;
            } else {
                return `${baseClasses} bg-gray-100 text-gray-700 hover:bg-[#B351FF]/10 hover:text-[#B351FF]`;
            }
        }
    };

    return (
        <Link 
            href={href} 
            onClick={() => setSelected(id)} 
            className={getButtonClasses()}
        >
            {Icon && <Icon className="w-4 h-4" />}
            <span>{label}</span>
        </Link>
    );
};

export default NavElement;