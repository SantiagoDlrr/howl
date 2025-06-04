"use client";

import Link from "next/link";

interface ButtonProps {
    label: string,
    onClick?: () => void,
    secondary?: boolean
    white?: boolean
    href?: string
    xl?: boolean
    type?: "button" | "submit" | "reset"
}

const Button = ({ label, onClick, secondary, white, href, xl, type }: ButtonProps) => {
    const btnType = type ?? "button";
    
    // Determine button styles based on variant
    const getButtonStyles = () => {
        if (white) {
            return "border-2 border-white text-white hover:bg-white hover:text-black transition-colors";
        } else if (secondary) {
            return "border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors";
        } else {
            return "bg-primary text-white hover:bg-primary/90 transition-colors";
        }
    };

    const baseStyles = `${xl ? "rounded-md w-full" : "rounded-full"} text-center px-4 py-1 min-w-28 font-semibold`;
    const buttonStyles = `${getButtonStyles()} ${baseStyles}`;

    return (
        <>
            {href ? (
                <Link href={href} className={buttonStyles}>
                    {label}
                </Link>
            ) : (
                <button type={btnType} onClick={onClick} className={buttonStyles}>
                    {label}
                </button>
            )}
        </>
    )
}

export default Button;