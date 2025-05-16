"use client";

import { api } from "@/trpc/react";
import Field from "../forms/field";
import Modal from "./modal";
import { useState } from "react";
import { companySchema } from "@/app/utils/schemas/companySchemas";
import toast from "react-hot-toast";
import { defaultCompany } from "@/app/utils/types/companyInput";
import type { CompanyInput } from "@/app/utils/types/companyInput";
import CompanyForms from "../forms/companyForms";

interface NewCompanyModalProps {
    isOpen: boolean;
    onClose: () => void;
    setColumnId: (id: number | null) => void;
    setShow: (num: number) => void;
}

const NewCompanyModal = ({ isOpen, onClose, setColumnId, setShow }: NewCompanyModalProps) => {
    const utils = api.useUtils();

    const createCompany = api.company.createCompany.useMutation({
        onSuccess: async (data) => {
            toast.success(`Empresa ${data.name} creada`);
            setShow(1);
            setColumnId(data.id);
            await utils.company.getAll.invalidate();
        },
        onError: (error) => {
            toast.error(`Error creando empresa: ${error.message}`);
        },
    });

    const [input, setInput] = useState<CompanyInput>(defaultCompany)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            input.client_since = new Date();
            const parsedInput = companySchema.parse(input);
            await createCompany.mutateAsync(parsedInput);

            onClose();
        }
        catch (error) {
            console.error("Error creating company:", error);
        }
    }

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

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="text-xl font-semibold mb-4">
                Nueva Empresa
            </div>
            <form onSubmit={handleSubmit} className="px-2 pt-4 pb-6">
                <div className="flex flex-col gap-3 pb-6">
                    <Field strong label="Nombre *" required value={input.name} isEditing={true} onChange={(val: string) => handleNameFieldChange(val)} />
                </div>
                <CompanyForms input={input} isEditing={true} handleAddressFieldChange={handleAddressFieldChange} />
                <div className="flex flex-row gap-4 pt-8">
                    <button onClick={onClose} className="flex-1 w-full bg-bg-dark text-text px-3 py-1 rounded hover:bg-bg-extradark transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" className="flex-1 bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition-colors">
                        Guardar
                    </button>
                </div>
            </form>
        </Modal>
    )
}

export default NewCompanyModal;