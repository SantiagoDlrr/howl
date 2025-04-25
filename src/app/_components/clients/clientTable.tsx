"use client";

import { api } from "@/trpc/react";
import Spinner from "../spinner";
import { useMemo, useState } from "react";
import SearchBar from "./searchBar";

interface CompanyProps {
    onClick: (id: number) => void;
    onSeeCompany: (id: number) => void;
    setCompanyId: (id: number | null) => void;
    companyId: number | null;
}

const ClientTable = ({ onClick, onSeeCompany, companyId, setCompanyId }: CompanyProps) => {

    const { data: clients, isLoading: isLoading } = api.client.get.useQuery(companyId);
    const { data: company, isLoading: isLoadingCompany } = api.company.getById.useQuery(companyId ?? -1);
    const { data: companies, isLoading: isLoadingCompanies } = api.company.getAll.useQuery();
    const [companyName, setCompanyName] = useState<string>(company?.name ?? 'Clientes');
    const [companySelection, setCompanySelection] = useState<string>(companyName);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const filteredClients = useMemo(() => {
        if (!clients) return [];
        const filteredClients = clients?.filter(client =>
            (companySelection === 'Clientes' || client.company?.name === companySelection) &&
            (searchTerm === '' ||
                Object.values(client).some(value =>
                    typeof value === 'string' &&
                    value.toLowerCase().includes(searchTerm.toLowerCase())
                ))
        );
        // (searchTerm === '' || 
        //     Object.values(client).some(value =>
        //         typeof value === 'string' &&
        //         value.toLowerCase().includes(searchTerm.toLowerCase())
        //     ))
        // );
        return filteredClients;
    }, [clients, searchTerm, companySelection]);


    const resetFilters = () => {
        setCompanyId(null);
        setCompanyName('Clientes');
        setCompanySelection('Clientes');
        setSearchTerm("");
        setCurrentPage(1);
    }

    if (isLoading) {
        return (
            <Spinner />
        )
    }

    if (!clients || clients.length === 0 || !companies) {
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
                {company?.name ? `Clientes de ${company?.name}` : 'Clientes'}
            </div>

            <div className="w-full flex flex-row gap-3 mb-6">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} setCurrentPage={setCurrentPage} />
                <select
                    value={companySelection}
                    onChange={(e) => {
                        setCompanySelection(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="border rounded px-2 py-1"
                >
                    <option value="">Todas las empresas</option>
                    {companies.map(company => (
                        <option key={company.id} value={company.name}>{company.name}</option>
                    ))}
                </select>
                <button
                    onClick={resetFilters}
                    className="bg-[#F9FBFF] hover:bg-gray-300 rounded px-2 border border-black"
                >
                    Restablecer
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
                        {filteredClients.map((client, index) => (
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