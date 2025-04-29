"use client";

import { api } from "@/trpc/react";
import Field from "../field";
import Modal from "./modal";
import { useState } from "react";
import { companySchema } from "@/app/utils/schemas/companySchemas";
import toast from "react-hot-toast";

interface NewCompanyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface CompanyInput {
    name: string;
    address: {
        country: string;
        state: string;
        city: string;
        street: string;
    };
    client_since: Date;
}

const defaultCompany: CompanyInput = {
    name: "",
    address: {
        country: "",
        state: "",
        city: "",
        street: "",
    },
    client_since: new Date(),
}

const NewCompanyModal = ({ isOpen, onClose }: NewCompanyModalProps) => {
    const utils = api.useUtils();

    const createCompany = api.company.createCompany.useMutation({
        onSuccess: async (data) => {
            toast.success(`Empresa ${data.name} creada`);
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
            <form onSubmit={handleSubmit} className="px-2 pt-4 pb-5">
                <div className="flex flex-col gap-3">
                    <Field strong label="Nombre" required value={input.name} isEditing={true} onChange={(val: string) => handleNameFieldChange(val)} />
                </div>
                <div className="font-semibold pb-3 pt-8">
                    Dirección
                </div>
                <div className="flex flex-col gap-3">
                    <Field label="País" value={input.address.country} isEditing={true} onChange={(val: string) => handleAddressFieldChange("country", val)} />
                    <Field label="Estado" value={input.address.state} isEditing={true} onChange={(val: string) => handleAddressFieldChange("state", val)} />
                    <Field label="Ciudad" value={input.address.city} isEditing={true} onChange={(val: string) => handleAddressFieldChange("city", val)} />
                    <Field label="Calle" value={input.address.street} isEditing={true} onChange={(val: string) => handleAddressFieldChange("street", val)} />
                </div>
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