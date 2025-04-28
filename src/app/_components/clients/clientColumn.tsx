"use client";

import { api } from "@/trpc/react";
import Button from "../button";
import { useState } from "react";
import { RingLoader } from "react-spinners";
import Spinner from "../spinner";
import Field from "./field";

interface ClientColumnProps {
    id: number;
}

const ClientColumn = ({ id }: ClientColumnProps) => {
    const { data: client, isLoading: loading } = api.client.getById.useQuery(id);
    const [editing, setEditing] = useState(false);
    const { data: companies, isLoading: loadingCompanies } = api.company.getAll.useQuery();
    const [selectedCompany, setSelectedCompany] = useState<number>(-1);

    if (loading) {
        return (
            <Spinner />
        )
    }

    if (!client) {
        return (
            <div className="bg-bg h-screen pt-24 px-20 w-full">
                <div className="flex justify-center items-center h-full">
                    <p className="text-lg">No hay empresa registrada</p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col gap-2 pt-20 px-10">
            <div className="font-semibold">
                {client.firstname} {client.lastname}
            </div>
            <div className="flex flex-col gap-3 pb-10">
                <Field label="Nombre" value={client.firstname} isEditing={editing} />
                <Field label="Apellido" value={client.lastname} isEditing={editing} />
                <Field label="Correo" value={client.email} isEditing={editing} />

                <div>
                    <div className="font-normal pb-1">
                        Empresa
                    </div>
                    {editing ? (
                        <select
                            value={selectedCompany}
                            className="border w-full rounded px-2 py-1"
                            onChange={(e) => {
                                setSelectedCompany(parseInt(e.target.value));
                            }}
                        >
                            <option value={-1} key={-1} selected>Selecciona una empresa</option>
                            {companies?.map((company) => (
                                <option key={company.id} value={company.id}>
                                    {company.name}
                                </option>
                            ))}
                        </select>

                    ) : (
                        <div className="text-text-light">
                            {client.company?.name}
                        </div>
                    )}
                </div>
            </div>

            {editing ? (
                <div className="flex flex-row gap-3">
                    <button onClick={() => setEditing(false)} className="flex-1 w-full bg-bg-dark text-text px-3 py-1 rounded hover:bg-bg-extradark transition-colors">
                        Cancelar
                    </button>
                    <button onClick={() => setEditing(false)} className="flex-1 bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition-colors">
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

export default ClientColumn;