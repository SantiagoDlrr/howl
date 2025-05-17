"use client";

import RestrictedAccess from "@/app/_components/auth/restrictedAccess";
import ClientColumn from "@/app/_components/clients/clientColumn";
import ClientTable from "@/app/_components/clients/clientTable";
import CompanyColumn from "@/app/_components/clients/companyColumn";
import CompanyTable from "@/app/_components/clients/companyTable";
import NewClientModal from "@/app/_components/clients/modals/newClientModal";
import NewCompanyModal from "@/app/_components/clients/modals/newCompanyModal";
import { ResizablePanel } from "@/app/_components/main/panels/resizablePanel";
import ToggleButton from "@/app/_components/toggleButton";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

const ClientsPage = () => {

    const [panelWidth, setpanelWidth] = useState(0);
    const [selected, setSelected] = useState<number>(1);
    const [columnId, setColumnId] = useState<number | null>(null);
    const [show, setShow] = useState(0);
    const [companyId, setCompanyId] = useState<number | null>(null);
    const [showNewCompanyModal, setShowNewCompanyModal] = useState(false);
    const [showNewClientModal, setShowNewClientModal] = useState(false);
    const [editingCompany, setEditingCompany] = useState(false);
    const [editingClient, setEditingClient] = useState(false);

    const handleSelectCompany = (companyId: number) => {
        setShow(1);
        setColumnId(companyId);
        setpanelWidth(500);
    }

    const handleSelectClient = (clientId: number) => {
        setShow(2);
        setColumnId(clientId);
        setpanelWidth(500);
    }

    const handleSeeClients = (companyId: number) => {
        setSelected(2);
        setCompanyId(companyId);
    }

    const handleCloseColumn = () => {
        setShow(0);
        setpanelWidth(0);
    }

    const { data: session } = useSession();
    if (!session?.user) {
        return (
            <RestrictedAccess />
        )
    }

    //     // Obtener el rol del usuario
    // try {

    //     const userRole = await getUserRoleFromDb(session.user.id);

    //     if (!userRole || userRole.role !== 'administrator') {
    //         // Solo los administradores pueden acceder a esta página
    //         return (
    //             <RestrictedAccess />
    //         )
    //     }
    // } catch (error) {
    //     console.error('Error al verificar rol del usuario:', error);

    //     return (
    //         <div className="container mx-auto py-8 px-4">
    //             <div className="p-4 bg-red-100 text-red-700 rounded">
    //                 Error al verificar permisos. Por favor, intenta de nuevo más tarde.
    //             </div>
    //         </div>
    //     );
    // }



    // Testing
    // TODO (@alecoeto): Show page for admins only?
    // TODO (@alecoeto): Add tests to client and company table
    // TODO (@alecoeto): Add tests to client and company column
    // TODO (@alecoeto): Add tests to client and company modals
    // TODO (@alecoeto): Add tests to page setup

    return (
        <>
            <div className="w-full flex flex-row h-screen pt-24">
                <div className="flex flex-col w-full justify-start items-center">
                    <div className="bg-bg-dark w-1/3 flex flex-row items-center rounded-md p-1 mb-4">
                        <ToggleButton id={1} selected={selected === 1} setSelected={setSelected} large label="Empresas" />
                        <ToggleButton id={2} selected={selected === 2} setSelected={setSelected} large label="Clientes" />
                    </div>
                    {selected === 1 ? (
                        <CompanyTable onSeeClients={handleSeeClients} onClick={handleSelectCompany} openModal={() => setShowNewCompanyModal(true)} editCompany={setEditingCompany} />
                    ) : (
                        <ClientTable companyId={companyId} setCompanyId={setCompanyId} onSeeCompany={handleSelectCompany} onClick={handleSelectClient} openModal={() => setShowNewClientModal(true)} editClient={setEditingClient} />
                    )}
                </div>

                <ResizablePanel
                    width={panelWidth}
                    minWidth={0}
                    maxWidth={1000}
                    side="right"
                    onResize={setpanelWidth}
                >
                    {panelWidth > 0 && (
                        <div className="flex flex-row justify-end pr-6">
                            <button id="client-close-column" onClick={handleCloseColumn} className="text-gray-400 hover:text-gray-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                    {columnId && (
                        (show === 1) ? (
                            <CompanyColumn id={columnId} editing={editingCompany} setEditing={setEditingCompany} />
                        ) : (
                            <ClientColumn id={columnId} editing={editingClient} setEditing={setEditingClient} />
                        )
                    )}
                </ResizablePanel>
                {/* )} */}
            </div>
            {showNewCompanyModal && (
                <NewCompanyModal isOpen={showNewCompanyModal} onClose={() => setShowNewCompanyModal(false)} setColumnId={setColumnId} setShow={setShow} />
            )}
            {showNewClientModal && (
                <NewClientModal isOpen={showNewClientModal} onClose={() => setShowNewClientModal(false)} setColumnId={setColumnId} setShow={setShow} />
            )}
        </>
    )
}

export default ClientsPage;

