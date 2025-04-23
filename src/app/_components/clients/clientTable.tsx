"use client";

import { api } from "@/trpc/react";
import Spinner from "../spinner";

interface CompanyProps {
    onClick: (id: number) => void;
    onSeeCompany: (id: number) => void;
    id: number | null;
}

const ClientTable = ({ onClick, onSeeCompany, id }: CompanyProps) => {

    // const { data: clients, isLoading } = id ? api.client.getById.useQuery(id) : api.client.getAll.useQuery();
    const { data: clients, isLoading: isLoading } = api.client.get.useQuery(id);

    if (isLoading) {
        return (
            <Spinner />
        )
    }

    if (!clients || clients.length === 0) {
        return (
            <div className="bg-bg h-screen px-20 w-full">
                <div className="flex justify-center items-center h-full">
                    <p className="text-lg">No hay empresas registradas</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-bg h-screen pt-24 px-20 w-full">

            <div className="overflow-x-auto rounded border border-black w-full">

                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-3 text-left">Empresa</th>
                            <th className="p-3 text-left">Cliente Desde</th>
                            <th className="p-3 text-left">Contactos</th>
                            <th className="p-3 text-left">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client, index) => (
                            <tr
                                key={index}
                                className="border-b hover:bg-gray-50 transition-colors"
                            >
                                <td className="p-3">{client.firstname} {client.lastname} </td>
                                <td className="p-3">{client.email}</td>
                                <td className="p-3">
                                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                        {client.company?.name}
                                    </span>
                                </td>
                                <td className="p-3 flex flex-row gap-2">
                                    <button onClick={() => onSeeCompany(client.company_id ?? 0)} className="bg-bg-dark text-text px-3 py-1 rounded hover:bg-bg-extradark transition-colors">
                                        Ver Empresa
                                    </button>
                                    <button onClick={() => onClick(client.id)} className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition-colors">
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </div>
    )
}

export default ClientTable;