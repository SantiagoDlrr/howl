import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline';
  icon?: string;
  fullWidth?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  icon,
  fullWidth = false,
  onClick,
  disabled = false
}) => {
  const baseStyles = "flex items-center justify-center rounded-md py-2 px-4 transition-colors focus:outline-none";
  
  const variantStyles = {
    primary: "bg-purple-600 text-white hover:bg-purple-700 disabled:bg-purple-400",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
  };
  
  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;