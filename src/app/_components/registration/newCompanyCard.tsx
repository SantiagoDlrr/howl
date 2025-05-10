"use client";

import { useState } from "react";
import ErrorMessage from "../auth/errorMessage";
import FormField from "../auth/formField";
import Button from "../button";
import { defaultEnterprise, Enterprise } from "@/app/utils/types/enterprise";

const NewCompanyCard = () => {
    const [error, setError] = useState("");
    const [input, setInput] = useState<Enterprise>(defaultEnterprise);

    const handleInputChange = (key: keyof Enterprise, value: string) => {
        setInput((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSubmit = () => {
        //crear empresa
    }

    return (
        <div data-testid="signup-card" className="bg-white w-1/3  p-8 rounded-lg flex flex-col px-20">
            <h1 className="text-center font-normal text-2xl pb-10">
                Registro de Nueva Organización
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
                {error && <ErrorMessage message={error} />}
                <div className="flex flex-col gap-2 w-full pb-10">
                    <FormField testId="signup-name" label="Nombre" xl type="text" value={input.name} onChange={(e) => handleInputChange("name", e.target.value)} />
                    {/* <FormField testId="signup-name" label="" xl type="text" value={input.name} onChange={(e) => handleInputChange("name", e.target.value)} /> */}
                </div>
                <div className="flex flex-row justify-center pb-5 w-full">
                    <Button label="Registrar" xl type="submit" />
                </div>
            </form>
        </div>
    )
}

export default NewCompanyCard;