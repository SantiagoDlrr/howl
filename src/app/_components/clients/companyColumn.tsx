"use client";

import { api } from "@/trpc/react";
import Button from "../button";
import { useState } from "react";
import { RingLoader } from "react-spinners";
import Spinner from "../spinner";

interface CompanyColumnProps {
    id: number;
}

const CompanyColumn = ({ id }: CompanyColumnProps) => {
    const { data: company, isLoading: loadingCompany } = api.company.getById.useQuery(id);
    const { data: clients, isLoading } = api.client.getByCompanyId.useQuery(id);
    const [editing, setEditing] = useState(false);

    if (loadingCompany || isLoading) {
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
        <div className="w-full flex flex-col gap-2 pt-20 px-10">
            <div className="font-semibold">
                {company.name}
            </div>
            <div>
                Cliente desde {company.client_since.toLocaleDateString()}
            </div>
            <div>

            </div>
            <button onClick={() => { console.log('a') }} className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition-colors">
                Editar
            </button>
        </div>
    );
}

export default CompanyColumn;