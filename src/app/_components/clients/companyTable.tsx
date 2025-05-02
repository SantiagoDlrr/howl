"use client";

import { api } from "@/trpc/react";
import Spinner from "../spinner";
import { useMemo, useState } from "react";
import SearchBar from "./searchBar";
import { GoPlus } from "react-icons/go";

interface CompanyProps {
    onClick: (id: number) => void;
    onSeeClients: (id: number) => void;
    openModal: () => void;
}

const CompanyTable = ({ onClick, onSeeClients, openModal }: CompanyProps) => {

    const { data: companies, isLoading } = api.company.getAll.useQuery();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const filteredCompanies = useMemo(() => {
        if (!companies) return [];
        return companies
            .filter(company =>
            (searchTerm === '' ||
                Object.values(company).some(value =>
                    typeof value === 'string' &&
                    value.toLowerCase().includes(searchTerm.toLowerCase())
                ))
            )
    }, [companies, searchTerm]);

    if (isLoading) {
        return (
            <Spinner />
        )
    }

    if (!companies || companies.length === 0) {
        return (
            <div className="bg-bg h-screen px-20 w-full">
                <div className="flex justify-center items-center h-full">
                    <p className="text-lg">No hay empresas registradas</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-bg h-screen pt-4 pb-24 px-20 w-full">

            <div className="text-xl font-semibold pb-5">
                {"Empresas"}
            </div>

            <div className="flex flex-row items-center pb-6 gap-2">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} setCurrentPage={setCurrentPage} />
                <button onClick={openModal} className="flex flex-row items-center gap-2 bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition-colors">
                    <GoPlus className="text-xl" />
                    <div>
                        Nueva Empresa
                    </div>
                </button>
            </div>

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
                        {filteredCompanies.map((company, index) => (
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
                                    <button onClick={() => onSeeClients(company.id)} className="bg-bg-dark text-text px-3 py-1 rounded hover:bg-bg-extradark transition-colors">
                                        Ver clientes
                                    </button>
                                    <button onClick={() => onClick(company.id)} className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition-colors">
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

export default CompanyTable;