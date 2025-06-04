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
}

const NavElement = ({ label, isSelected, href, setSelected, id, icon: Icon }: NavElementProps) => {
    return (
        <Link 
            href={href} 
            onClick={() => setSelected(id)} 
            className={`group flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ease-out hover:scale-105 min-w-32 ${
                isSelected 
                    ? "bg-[#B351FF] text-white shadow-lg" 
                    : "bg-gray-100 text-gray-700 hover:bg-[#B351FF]/10 hover:text-[#B351FF]"
            }`}
        >
            {Icon && <Icon className="w-4 h-4" />}
            <span>{label}</span>
        </Link>
    );
};

export default NavElement;