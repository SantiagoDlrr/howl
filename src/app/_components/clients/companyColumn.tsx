"use client";

import { api } from "@/trpc/react";
import Button from "../button";
import { useState } from "react";
import { RingLoader } from "react-spinners";
import Spinner from "../spinner";
import Field from "./field";

interface CompanyColumnProps {
    id: number;
}

const CompanyColumn = ({ id }: CompanyColumnProps) => {
    const { data: company, isLoading: loadingCompany } = api.company.getById.useQuery(id);
    // const { data: clients, isLoading } = api.client.getByCompanyId.useQuery(id);
    const [editing, setEditing] = useState(false);

    if (loadingCompany) {
        return (
            <Spinner />
        )
    }

    if (!company) {
        return (
            <div className="bg-bg h-screen pt-24 px-20 w-full">
                <div className="flex justify-center items-center h-full">
                    <p className="text-lg">No hay empresa registrada</p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col justify-center gap-2 pt-10 px-10">
            <div className="font-semibold text-xl">
                {company.name}
            </div>
            <div className="text-text-light pb-10">
                Cliente desde {company.client_since.toLocaleDateString()}
            </div>

            <div className="font-semibold">
                Dirección
            </div>
            <div className="flex flex-col gap-3 pb-10">
                <Field label="País" value={company.address?.country} isEditing={editing} />
                <Field label="Estado" value={company.address?.state} isEditing={editing} />
                <Field label="Ciudad" value={company.address?.city} isEditing={editing} />
                <Field label="Calle" value={company.address?.street} isEditing={editing} />
            </div>
            <div>

            </div>
            {editing ? (
                <div className="flex flex-row gap-3">
                    <button onClick={() => setEditing(false)} className="flex-1 w-full bg-bg-dark text-text px-3 py-1 rounded hover:bg-bg-extradark transition-colors">
                        Cancelar
                    </button><button onClick={() => setEditing(false)} className="flex-1 bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition-colors">
                        Guardar
                    </button>
                </div>
            ) : (
                <div className="flex flex-row gap-3">
                    <button onClick={() => setEditing(false)} className="flex-1 w-full bg-bg-dark text-text px-3 py-1 rounded hover:bg-bg-extradark transition-colors">
                        Eliminar
                    </button>
                    <button onClick={() => setEditing(true)} className="flex-1 bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition-colors">
                        Editar
                    </button>
                </div>
            )}
        </div>
    );
}

export default CompanyColumn;