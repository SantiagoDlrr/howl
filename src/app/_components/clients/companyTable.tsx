"use client";

import { api } from "@/trpc/react";
import Spinner from "../spinner";
import { useMemo, useState } from "react";
import SearchBar from "./searchBar";
import { GoPlus } from "react-icons/go";
import Pagination from "./pagination";

interface CompanyProps {
    onClick: (id: number) => void;
    onSeeClients: (id: number) => void;
    openModal: () => void;
    editCompany: (value: boolean) => void;
}

const CompanyTable = ({ onClick, onSeeClients, openModal, editCompany }: CompanyProps) => {

    const { data: companies, isLoading } = api.company.getAll.useQuery();
    
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 8;
    const lastIndex = currentPage * logsPerPage;
    const firstIndex = lastIndex - logsPerPage;

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

    const currentCompanies = useMemo(() => {
        if (!filteredCompanies) return [];
        return filteredCompanies.slice(firstIndex, lastIndex);
    }, [filteredCompanies, firstIndex, lastIndex]);

    const totalPages = useMemo(() => {
        if (!companies) return 0;
        return Math.ceil(companies.length / logsPerPage);
    }, [companies, logsPerPage]);


    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const openCompanyHandler = (id: number) => {
        onClick(id);
        editCompany(false);
    }
    const editCompanyHandler = (id: number) => {
        onClick(id);
        editCompany(true);
    }


    if (isLoading) {
        return (
            <Spinner />
        )
    }


    return (
        <div data-cy="company-table" className="bg-bg h-screen pt-4 pb-24 px-20 w-full">

            <div className="text-xl font-semibold pb-5">
                {"Empresas"}
            </div>

            <div className="flex flex-row items-center pb-6 gap-2">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} setCurrentPage={setCurrentPage} />
                <button id="new-company-btn" onClick={openModal} className="flex flex-row items-center gap-2 bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition-colors">
                    <GoPlus className="text-xl" />
                    <div>
                        Nueva Empresa
                    </div>
                </button>
            </div>

            <div className="overflow-x-auto rounded border border-black w-full">

                <table data-cy="company-table-element" className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-3 text-left">Empresa</th>
                            <th className="p-3 text-left">Cliente Desde</th>
                            <th className="p-3 text-left">Contactos</th>
                            <th className="p-3 text-left">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCompanies.map((company, index) => (
                            <tr
                                data-cy={`company-${index}`}
                                key={index}
                                onClick={() => openCompanyHandler(company.id)}
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
                                    <button
                                        data-cy={`edit-company-${index}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            editCompanyHandler(company.id)
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
                length={filteredCompanies.length}
                firstIndex={firstIndex}
                lastIndex={lastIndex}
                paginate={paginate}
            />

        </div>
    )
}

export default CompanyTable;