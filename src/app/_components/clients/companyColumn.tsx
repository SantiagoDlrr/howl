"use client";

import { api } from "@/trpc/react";
import { useEffect, useState } from "react";
import Spinner from "../spinner";
import Field from "./forms/field";
import toast from "react-hot-toast";
import { CompanyInput, defaultCompany } from "@/app/utils/types/companyInput";
import CompanyForms from "./forms/companyForms";
import DoubleButtons from "./forms/DoubleButtons";

interface CompanyColumnProps {
    id: number;
    editing: boolean;
    setEditing: (editing: boolean) => void;
}

const CompanyColumn = ({ id, editing, setEditing }: CompanyColumnProps) => {
    const { data: company, isLoading: loadingCompany } = api.company.getById.useQuery(id);
    const utils = api.useUtils();
    const [input, setInput] = useState<CompanyInput>(defaultCompany);

    const handleNameFieldChange = (value: string) => {
        setInput((prev) => ({
            ...prev,
            ["name"]: value,
        }));
    }

    const handleAddressFieldChange = (key: keyof CompanyInput["address"], value: string) => {
        setInput((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                [key]: value,
            },
        }));
    };
    const updateCompany = api.company.editCompany.useMutation({
        onSuccess: async () => {
            toast.success(`Empresa ${company?.name} actualizada`);
            await utils.company.invalidate();
        },
        onError: (error) => {
            toast.error(`Error actualizando empresa: ${error.message}`);
        },
    });
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const parsedInput = {
                ...input,
                id: id,
            };
            await updateCompany.mutateAsync(parsedInput);
            setEditing(false);
        } catch (error) {
            console.error("Error creating company:", error);
        }
    }

    useEffect(() => {
        if (company) {
            setInput({
                name: company.name ?? "",
                client_since: company.client_since,
                address: {
                    country: company.address?.country ?? "",
                    state: company.address?.state ?? "",
                    city: company.address?.city ?? "",
                    street: company.address?.street ?? "",
                },
            });
        }
    }, [company]);

    const deleteCompany = api.company.deleteCompany.useMutation({
        onSuccess: async () => {
            toast.success(`Empresa ${company?.name} eliminada`);
            await utils.company.invalidate();
        },
        onError: (error) => {
            toast.error(`Error eliminando empresa: ${error.message}`);
        },
    });

    const handleDelete = async () => {
        if (!company) return;
        if (confirm(`¿Estás seguro de que quieres eliminar a ${company.name}?`)) {
            await deleteCompany.mutateAsync(company.id);
        }
    }

    if (loadingCompany) {
        return (
            <Spinner />
        )
    }

    if (!company) {
        return (
            <div className="bg-bg h-screen pt-24 px-20 w-full">
                <div className="flex justify-center items-center h-full">
                    <p className="text-lg">Selecciona una empresa</p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col justify-center gap-2 pt-10 px-10">
            <div className="font-semibold text-xl">
                {company.name}
            </div>
            <div className="text-text-light pb-6">
                Cliente desde {company.client_since.toLocaleDateString()}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 pb-10">
                {editing && (
                    <div className="flex flex-col gap-3">
                        <Field strong label="Nombre" required value={input.name} isEditing={editing} onChange={(val: string) => handleNameFieldChange(val)} />
                    </div>
                )}

                <CompanyForms input={input} isEditing={editing} handleAddressFieldChange={handleAddressFieldChange} />
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

export default CompanyColumn;