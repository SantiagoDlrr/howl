"use client";
import NewCompanyCard from "@/app/_components/registration/newCompanyCard";
import RequestCompanyCard from "@/app/_components/registration/requestCompanyCard";
import ToggleButton from "@/app/_components/toggleButton";
import { useState } from "react";

const RegistrationPage = () => {
    const [selected, setSelected] = useState(1);
    return (
        <div className="w-full flex flex-row h-screen py-24 bg-slate-50">
            <div className="flex flex-col w-full justify-start items-center">
                <div className="bg-bg-dark w-1/3 flex flex-row items-center rounded-md p-1 mb-4">
                    <ToggleButton id={1} selected={selected === 1} setSelected={setSelected} large label="Nueva Empresa" />
                    <ToggleButton id={2} selected={selected === 2} setSelected={setSelected} large label="Aplicar a Empresa" />
                </div>

                <div className="w-full h-screen flex flex-col items-center justify-center">
                    {selected == 1 ? (
                        <NewCompanyCard />
                    ) : (
                        <RequestCompanyCard />
                    )}
                </div>
            </div>
        </div>
    )
}

export default RegistrationPage;