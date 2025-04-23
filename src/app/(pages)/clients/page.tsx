"use client";

import ClientColumn from "@/app/_components/clients/clientColumn";
import ClientTable from "@/app/_components/clients/clientTable";
import CompanyColumn from "@/app/_components/clients/companyColumn";
import CompanyTable from "@/app/_components/clients/companyTable";
import { ResizablePanel } from "@/app/_components/main/panels/resizablePanel";
import ToggleButton from "@/app/_components/toggleButton";
import { useState } from "react";

const ClientsPage = () => {

    const [leftPanelWidth, setLeftPanelWidth] = useState(500);
    const [selected, setSelected] = useState<number>(1);
    const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
    const [show, setShow] = useState(0);
    const [client_id, setClientId] = useState<number | null>(null);

    const handleSelection = (companyId: number) => {
        setShow(1);
        setSelectedCompany(companyId);
    }

    const handleClientSelection = (clientId: number) => {
        // Handle client selection here
        setShow(2);
        setSelectedCompany(clientId);
    }

    const handleSeeClients = (companyId: number) => {
        setClientId(companyId);
        setSelected(2);
        // setShow(1);
        // setSelectedCompany(companyId);
    }

    return (
        <div className="w-full flex flex-row h-screen pt-24">
            <div className="flex flex-col w-full justify-start items-center">
                <div className="bg-bg-dark w-1/3 flex flex-row items-center rounded-md p-1 mb-4">
                    <ToggleButton id={1} selected={selected === 1} setSelected={setSelected} large label="Empresas" />
                    <ToggleButton id={2} selected={selected === 2} setSelected={setSelected} large label="Clientes" />
                </div>
                {selected === 1 ? (
                    <CompanyTable onSeeClients={handleSeeClients} onClick={handleSelection} />
                ) : (
                    <ClientTable id={client_id} onSeeCompany={handleSelection} onClick={handleClientSelection} />
                )}
            </div>

            {selectedCompany && (
                <ResizablePanel
                    initialWidth={500}
                    minWidth={500}
                    maxWidth={1000}
                    side="right"
                    onResize={setLeftPanelWidth}
                >
                    {(show === 1) ? (
                        <CompanyColumn id={selectedCompany} />
                    ) : (

                        <ClientColumn id={selectedCompany} />
                    )}
                </ResizablePanel>
            )}
        </div>
    )
}

export default ClientsPage;