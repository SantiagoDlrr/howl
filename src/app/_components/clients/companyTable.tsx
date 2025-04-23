"use client";

import { api } from "@/trpc/react";
import Spinner from "../spinner";

interface CompanyProps {
    onClick: (id: number) => void;
}

const CompanyTable = ({onClick} : CompanyProps) => {

    const { data: companies, isLoading } = api.company.getAll.useQuery();

    if (isLoading) {
        return (
            <Spinner />
        )
    }

    if (!companies || companies.length === 0) {
        return (
            <div className="bg-bg h-screen pt-24 px-20 w-full">
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
                        {companies.map((company, index) => (
                            <tr
                                key={index}
                                className="border-b hover:bg-gray-50 transition-colors"
                            >
                                <td className="p-3">{company.name}</td>
                                <td className="p-3">{company.client_since.toLocaleDateString()}</td>
                                <td className="p-3">
                                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                        {company._count.client}
                                    </span>
                                </td>
                                <td className="p-3 flex flex-row gap-2">
                                    <button className="bg-bg-dark text-text px-3 py-1 rounded hover:bg-bg-extradark transition-colors">
                                        Editar
                                    </button>
                                    <button onClick={() => onClick(company.id)} className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition-colors">
                                        Ver detalles
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

export default CompanyTable;