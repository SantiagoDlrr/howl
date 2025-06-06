import { LayoutDashboard, Phone, FileText, Brain } from "lucide-react";

export const routes = [
    {
        id: 0,
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        isSelected: false
    },
    {
        id: 1,
        label: "Llamadas",
        href: "/main",
        icon: Phone,
        isSelected: false
    },
    {
        id: 2,
        label: "Logs",
        href: "/logs",
        icon: FileText,
        isSelected: false
    },
    {
        id: 3,
        label: "AI Tools",
        href: "/SCD",
        icon: Brain,
        isSelected: false
    }
];

// nav/logoElement.tsx
import React from 'react';
import Image from 'next/image';
import logo from 'howl/../public/images/logo.png';
import logoDark from 'howl/../public/images/logo-dark.png';

interface LogoElementProps {
    isLandingPage?: boolean;
    isScrolled?: boolean;
}

const LogoElement = ({ isLandingPage = false, isScrolled = false }: LogoElementProps) => {
    const getTextColor = () => {
        if (isLandingPage && !isScrolled) {
            return "text-white"; // White text when transparent on landing
        }
        return "text-gray-900"; // Dark text for normal state
    };

    const getLogoContainerColor = () => {
        if (isLandingPage && !isScrolled) {
            return "bg-white/20 border-white/30"; // Transparent with white accent
        }
        return "bg-[#B351FF]/10 border-[#B351FF]/20"; // Purple accent for normal state
    };

    const getLogoSrc = () => {
        if (isLandingPage && !isScrolled) {
            return logoDark; // Use dark logo when transparent on landing page
        }
        return logo; // Use regular logo for normal state
    };

    const getLogoClasses = () => {
        if (isLandingPage && !isScrolled) {
            return 'w-7 h-7 object-contain transition-all duration-300'; // Dark logo
        }
        return 'w-10 h-10 object-contain transition-all duration-300'; // Regular logo
    };

    return (
        <div className="flex flex-row items-center gap-3">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full border transition-all duration-300 ${getLogoContainerColor()}`}>
                <Image 
                    src={getLogoSrc()} 
                    alt={'Howl logo'} 
                    className={getLogoClasses()} 
                />
            </div>
            <h1 className={`font-medium text-xl transition-all duration-300 ${getTextColor()}`}>
                HowlX
            </h1>
        </div>
    )
}

export default LogoElement;