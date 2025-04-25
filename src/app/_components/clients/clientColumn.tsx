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
    // const { data: clients, isLoading } = api.client.getByCompanyId.useQuery(id);
    const [editing, setEditing] = useState(false);

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
                <Field label="Empresa" value={client.company?.name} isEditing={editing} />
            </div>
            <div>
                {client.email}
            </div>
            <div>

            </div>
            <button onClick={() => { console.log('a') }} className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition-colors">
                Editar
            </button>
        </div>
    );
}

export default ClientColumn;