"use client";

import ClientColumn from "@/app/_components/clients/clientColumn";
import CompanyTable from "@/app/_components/clients/companyTable";
import { ResizablePanel } from "@/app/_components/main/panels/resizablePanel";
import ToggleButton from "@/app/_components/toggleButton";
import { useState } from "react";

const ClientsPage = () => {

    const [leftPanelWidth, setLeftPanelWidth] = useState(500);
    const [selected, setSelected] = useState<number>(1);
    const [selectedCompany, setSelectedCompany] = useState<number | null>(null);

    const handleSelection = (companyId: number) => {
        setSelectedCompany(companyId);
    }

    return (
        <div className="flex flex-row h-screen">
            <ToggleButton id={0} selected={false} setSelected={function (id: number): void {
                throw new Error("Function not implemented.");
            } } />
            <CompanyTable onClick={handleSelection} />
           
            {selectedCompany && (
                <ResizablePanel
                    initialWidth={500}
                    minWidth={500}
                    maxWidth={1000}
                    side="right"
                    onResize={setLeftPanelWidth}
                >
                    <ClientColumn id={selectedCompany} />
                </ResizablePanel>
            )}
        </div>
    )
}

export default ClientsPage;