"use client";

interface ButtonProps {
    label: string,
    onClick?: () => void,
    secondary?: boolean
}

const Button = ({ label, onClick, secondary }: ButtonProps) => {
    return (
        <button onClick={onClick} className={`${secondary ? "border-2 border-primary text-primary" : "bg-primary text-white"} rounded-full px-4 py-1 min-w-28`}>
            {label}
        </button>
    )
}

export default Button;