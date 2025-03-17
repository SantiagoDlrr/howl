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

    return (
        <Link href={href} onClick={() => setSelected(id)} className="group flex flex-col justify-center items-center gap-1 min-w-32 hover:cursor-pointer">
            <div className=" text-sm">{label}</div>
            <div className={`h-2 w-full rounded-full ${isSelected ? "bg-primary" : "bg-gray group-hover:bg-primary-light"}`}></div>
        </Link>
    );
};

export default NavElement;