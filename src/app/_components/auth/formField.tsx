"use client";

import { useState } from "react";
import { IoMdEye } from "react-icons/io";


interface FormFieldProps {
    label: string;
    type?: string;
    xl?: boolean;
    value: string;
    testId?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormField = ({ label, type, value, onChange, testId }: FormFieldProps) => {
    const [view, setView] = useState(false);
    const originalType = type ?? "text";
    const [inputType, setInputType] = useState(type ?? "text");

    const toggleView = () => {
        setView(!view);
        if (view) {
            setInputType("text");
        } else {
            setInputType("password");
        }
    }

    return (
        <div className="flex flex-col gap-1 w-full">
            <div>
                {label}
            </div>
            <div className="relative flex flex-row justify-center items-center">
                <input data-testid={testId} type={inputType} value={value} onChange={onChange} className={`bg-bg-dark rounded-md px-2 w-full`} />
                {originalType === "password" && (
                    <button type="button" className="absolute right-0 mr-2 hover:text-gray-400" onClick={toggleView}>
                        <IoMdEye />
                    </button>
                )}
            </div>
        </div>
    )
}

export default FormField;