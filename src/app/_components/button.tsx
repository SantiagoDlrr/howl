"use client";

import Link from "next/link";

interface ButtonProps {
    label: string,
    onClick?: () => void,
    secondary?: boolean
    href?: string
    xl?: boolean
    type?: "button" | "submit" | "reset"
}

const Button = ({ label, onClick, secondary, href, xl, type }: ButtonProps) => {
    const btnType = type ?? "button";

    return (
        <>
            {href ? (
                <Link href={href} className={`${secondary ? "border-2 border-primary text-primary" : "bg-primary text-white"} ${xl ? "rounded-md w-full" : "rounded-full"} text-center px-4 py-1 min-w-28`}>
                    {label}
                </Link>
            ) : (
                <button type={btnType} onClick={onClick} className={`${secondary ? "border-2 border-primary text-primary" : "bg-primary text-white"} ${xl ? "rounded-md w-full" : "rounded-full"}  px-4 py-1 min-w-28`}>
                    {label}
                </button >
            )
            }
        </>
    )
}

export default Button;