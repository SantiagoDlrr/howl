"use client";
import { useState } from "react";
import ErrorMessage from "../auth/errorMessage";
import FormField from "../auth/formField";
import Button from "../button";

const RequestCompanyCard = () => {
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = () => {
        // crear request
        // si ya existe -> Notificar: request ya enviada
    }

    return (
        <div data-testid="signup-card" className="bg-white w-1/3  p-8 rounded-lg flex flex-col px-20">
            <div className="pb-10">

                <h1 className="text-center font-normal text-2xl">
                    Aplicar a empresa
                </h1>
                <p className="pt-4">
                    Ingresa el correo de un administrador de la empresa.
                </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
                {error && <ErrorMessage message={error} />}
                <div className="flex flex-col gap-2 w-full pb-10">
                    <FormField testId="signup-name" label="Correo" xl type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="flex flex-row justify-center pb-5 w-full">
                    <Button label="Enviar" xl type="submit" />
                </div>
            </form>
        </div>
    )
}
export default RequestCompanyCard;