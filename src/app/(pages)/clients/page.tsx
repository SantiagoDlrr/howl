"use client";

import ClientColumn from "@/app/_components/clients/clientColumn";
import CompanyTable from "@/app/_components/clients/companyTable";
import { ResizablePanel } from "@/app/_components/main/panels/resizablePanel";
import { useState } from "react";

const ClientsPage = () => {

    const [leftPanelWidth, setLeftPanelWidth] = useState(253);

    return (
        <div className="flex flex-row h-screen">
            <CompanyTable />
            <ResizablePanel
                initialWidth={200}
                minWidth={253}
                maxWidth={800}
                side="right"
                onResize={setLeftPanelWidth}
            >
                <ClientColumn />
            </ResizablePanel>
        </div>
    )
}

export default ClientsPage;