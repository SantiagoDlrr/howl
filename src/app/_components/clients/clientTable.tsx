"use client";

import { api } from "@/trpc/react";
import Spinner from "../spinner";
import { useMemo, useState } from "react";
import SearchBar from "./searchBar";
import { GoPlus } from "react-icons/go";
import Pagination from "./pagination";

interface CompanyProps {
    onClick: (id: number) => void;
    onSeeCompany: (id: number) => void;
    setCompanyId: (id: number | null) => void;
    openModal: () => void;
    companyId: number | null;
    editClient: (val: boolean) => void;
}

const ClientTable = ({ onClick, onSeeCompany, companyId, setCompanyId, openModal, editClient }: CompanyProps) => {

    const { data: clients, isLoading: isLoading } = api.companyClient.get.useQuery(companyId);
    const { data: company, isLoading: isLoadingCompany } = api.company.getById.useQuery(companyId ?? -1);
    const { data: companies, isLoading: isLoadingCompanies } = api.company.getAll.useQuery();
    const [companyName, setCompanyName] = useState<string>(company?.name ?? 'Clientes');
    const [companySelection, setCompanySelection] = useState<string>(companyName);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const logsPerPage = 8;
    const lastIndex = currentPage * logsPerPage;
    const firstIndex = lastIndex - logsPerPage;

    const totalPages = useMemo(() => {
        if (!clients) return 0;
        return Math.ceil(clients.length / logsPerPage);
    }, [clients, logsPerPage]);

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

        return filteredClients;
    }, [clients, searchTerm, companySelection]);

    const currentClients = useMemo(() => {
        if (!filteredClients) return [];
        return filteredClients.slice(firstIndex, lastIndex);
    }, [filteredClients, firstIndex, lastIndex]);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const resetFilters = () => {
        setCompanyId(null);
        setCompanyName('Clientes');
        setCompanySelection('Clientes');
        setSearchTerm("");
        setCurrentPage(1);
    }

    const openClientHandler = (id: number) => {
        onClick(id);
        editClient(false);
    }

    const editClientHandler = (id: number) => {
        onClick(id);
        editClient(true);
    }

    if (isLoading || isLoadingCompany || isLoadingCompanies) {
        return (
            <Spinner />
        )
    }

    return (
        <div data-cy="client-table" data-testid="clients-card" className="bg-bg h-screen pt-4 pb-24 px-20 w-full">
            <div className="text-xl font-semibold pb-5">
                {company?.name ? `Clientes de ${company?.name}` : 'Clientes'}
            </div>

            <div className="w-full flex flex-row gap-3 mb-6">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} setCurrentPage={setCurrentPage} />
                {companies ? (
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
                ) : (
                    <div className="border rounded px-2 py-1">
                        Aún no hay empresas
                    </div>
                )}

                <button
                    onClick={resetFilters}
                    className="bg-[#F9FBFF] hover:bg-gray-300 rounded px-2 border border-black"
                >
                    Restablecer
                </button>
                <button id="new-client-btn" onClick={openModal} className="flex flex-row items-center gap-2 bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition-colors">
                    <GoPlus className="text-xl" />
                    <div data-testid="new-client-button">
                        Nuevo Cliente
                    </div>
                </button>

            </div>

            <div className="overflow-x-auto rounded border border-black w-full">

                <table data-cy="client-table-element" className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-3 text-left">Empresa</th>
                            <th className="p-3 text-left">Cliente Desde</th>
                            <th className="p-3 text-left">Contactos</th>
                            <th className="p-3 text-left">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentClients.map((client, index) => (
                            <tr
                                data-cy={`client-${index}`}
                                key={index}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openClientHandler(client.id)
                                }}
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
                                    <button 
                                    id={`edit-client-${index}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        editClientHandler(client.id)
                                    }}
                                        className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition-colors">
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                length={filteredClients.length}
                firstIndex={firstIndex}
                lastIndex={lastIndex}
                paginate={paginate}
            />
        </div>
    )
}

export default ClientTable;