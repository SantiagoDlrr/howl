"use client";

import { api } from "@/trpc/react";
import { useEffect, useState } from "react";
import Spinner from "../spinner";
import toast from "react-hot-toast";
import { defaultClient } from "@/app/utils/types/clientInput";
import type { ClientInput } from "@/app/utils/types/clientInput";
import DoubleButtons from "./forms/DoubleButtons";
import ClientForms from "./forms/clientForms";

interface ClientColumnProps {
    id: number;
    editing: boolean;
    setEditing: (editing: boolean) => void;
}

const ClientColumn = ({ id, editing, setEditing }: ClientColumnProps) => {
    const utils = api.useUtils();
    const { data: client, isLoading: loading } = api.companyClient.getById.useQuery(id);
    const deleteClient = api.companyClient.deleteClient.useMutation({
        onSuccess: async () => {
            toast.success(`Cliente ${client?.firstname} ${client?.lastname} eliminado`);
            await utils.companyClient.invalidate();
        },
        onError: (error) => {
            toast.error(`Error eliminando cliente: ${error.message}`);
        },
    });
    const updateClient = api.companyClient.editClient.useMutation({
        onSuccess: async () => {
            toast.success(`Cliente ${client?.firstname} ${client?.lastname} actualizado`);
            await utils.companyClient.invalidate();
        },
        onError: (error) => {
            toast.error(`Error actualizando cliente: ${error.message}`);
        },
    });

    const { data: companies, isLoading: loadingCompanies } = api.company.getAll.useQuery();
    const [selectedCompany, setSelectedCompany] = useState<number>(-1);
    const [input, setInput] = useState<ClientInput>(defaultClient);
    useEffect(() => {
        if (client) {
            setInput({
                firstname: client.firstname ?? "",
                lastname: client.lastname ?? "",
                email: client.email ?? "",
                company_id: client.company_id ?? -1,
            });
            setSelectedCompany(client.company_id ?? -1); // Update selected company as well
        }
    }, [client]);
    const handleInputChange = (key: keyof ClientInput, value: string) => {
        setInput((prev) => ({
            ...prev,
            [key]: value,
        }));
    }

    const handleDelete = async () => {
        if (!client) return;
        if (confirm(`¿Estás seguro de que quieres eliminar a ${client.firstname} ${client.lastname}?`)) {
            await deleteClient.mutateAsync(client.id);
        }
    }
    if (loading || loadingCompanies) {
        return (
            <Spinner />
        )
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (selectedCompany === -1) {
            toast.error("Por favor selecciona una empresa");
            return;
        }
        try {
            const parsedInput = {
                ...input,
                company_id: selectedCompany,
                id: id
            };
            await updateClient.mutateAsync(parsedInput);
            setEditing(false);
        }
        catch (error) {
            console.error("Error creating client:", error);
        }
    }

    if (!client) {
        return (
            <div className="bg-bg h-screen pt-24 px-20 w-full">
                <div className="flex justify-center items-center h-full">
                    <p className="text-lg">Selecciona un cliente</p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col gap-2 pt-20 px-10">
            <div className="font-semibold text-xl pb-5">
                {client.firstname} {client.lastname}
            </div>
            <form onSubmit={handleSubmit} className="pb-10">

                <ClientForms
                    isEditing={editing}
                    input={input}
                    companies={companies}
                    selectedCompany={selectedCompany}
                    handleInputChange={handleInputChange}
                    setSelectedCompany={setSelectedCompany}
                />
                {editing && (
                    <div className="pt-10">
                        <DoubleButtons
                            labels={["Cancelar", "Guardar"]}
                            onClick1={() => setEditing(false)}
                            types={["button", "submit"]}
                        />
                    </div>
                )}
            </form>

            {!editing && (
                <DoubleButtons
                    labels={["Eliminar", "Editar"]}
                    onClick1={handleDelete}
                    onClick2={() => setEditing(true)}
                    types={["button", "button"]}
                />
            )}
        </div>
    );
}

export default ClientColumn;