"use client";

import ClientColumn from "@/app/_components/clients/clientColumn";
import ClientTable from "@/app/_components/clients/clientTable";
import CompanyColumn from "@/app/_components/clients/companyColumn";
import CompanyTable from "@/app/_components/clients/companyTable";
import { ResizablePanel } from "@/app/_components/main/panels/resizablePanel";
import ToggleButton from "@/app/_components/toggleButton";
import { X } from "lucide-react";
import { useState } from "react";

const ClientsPage = () => {

    const [leftPanelWidth, setLeftPanelWidth] = useState(500);
    const [selected, setSelected] = useState<number>(1);
    const [columnId, setColumnId] = useState<number | null>(null);
    const [show, setShow] = useState(0);
    const [companyId, setCompanyId] = useState<number | null>(null);

    const handleSelectCompany = (companyId: number) => {
        setShow(1);
        setColumnId(companyId);
    }

    const handleSelectClient = (clientId: number) => {
        setShow(2);
        setColumnId(clientId);
    }

    const handleSeeClients = (companyId: number) => {
        setCompanyId(companyId);
        setSelected(2);
    }

    return (
        <div className="w-full flex flex-row h-screen pt-24">
            <div className="flex flex-col w-full justify-start items-center">
                <div className="bg-bg-dark w-1/3 flex flex-row items-center rounded-md p-1 mb-4">
                    <ToggleButton id={1} selected={selected === 1} setSelected={setSelected} large label="Empresas" />
                    <ToggleButton id={2} selected={selected === 2} setSelected={setSelected} large label="Clientes" />
                </div>
                {selected === 1 ? (
                    <CompanyTable onSeeClients={handleSeeClients} onClick={handleSelectCompany} />
                ) : (
                    <ClientTable companyId={companyId} setCompanyId={setCompanyId} onSeeCompany={handleSelectCompany} onClick={handleSelectClient} />
                )}
            </div>

            {(show !== 0 && columnId) && (
                <ResizablePanel
                    initialWidth={500}
                    minWidth={500}
                    maxWidth={1000}
                    side="right"
                    onResize={setLeftPanelWidth}
                >
                    <div className="flex flex-row justify-end pr-6">
                        <button onClick={() => setShow(0)} className="text-gray-400 hover:text-gray-500">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    {(show === 1) ? (
                        <CompanyColumn id={columnId} />
                    ) : (

                        <ClientColumn id={columnId} />
                    )}
                </ResizablePanel>
            )}
        </div>
    )
}

export default ClientsPage;