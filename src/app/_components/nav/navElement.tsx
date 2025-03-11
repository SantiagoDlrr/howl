"use client";

import Link from "next/link";

interface NavElementProps {
    id: number;
    label: string;
    isSelected: boolean;
    href: string;
    setSelected: (key: number) => void;
}

const NavElement = ({ label, isSelected, href, setSelected, id }: NavElementProps) => {
    const hoverAnimation = isSelected
        ? "bg-primary"
        : "bg-secondary hover:bg-gradient-to-r from-secondary to-primary-light hover:bg-[length:200%_100%] hover:animate-gradient-slide";

    return (
        <Link href={href} onClick={() => setSelected(id)} className="group flex flex-col justify-center items-center gap-1 min-w-32 hover:cursor-pointer">
            <div className="text-white text-sm">{label}</div>
            <div
                className={`h-3 w-full rounded-full ${hoverAnimation}`}
            ></div>
        </Link>
    );
};

export default NavElement;