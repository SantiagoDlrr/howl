"use client";
import { api } from "@/trpc/react";
import Field from "../field";
import Modal from "./modal";
import Spinner from "../../spinner";
import { useState } from "react";
import { company } from "@prisma/client";
import toast from "react-hot-toast";

interface NewClientModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ClientInput {
    firstname: string;
    lastname: string;
    email: string;
    company_id: number;
}

const defaultClient: ClientInput = {
    firstname: "",
    lastname: "",
    email: "",
    company_id: -1,
}


const NewClientModal = ({ isOpen, onClose }: NewClientModalProps) => {
    const { data: companies, isLoading } = api.company.getAll.useQuery();
    const utils = api.useUtils();

    const createClient = api.companyClient.createClient.useMutation({
        onSuccess: async (data) => {
            toast.success(`Cliente ${data.firstname} ${data.lastname} creado`);
            await utils.companyClient.invalidate();
        },
        onError: (error) => {
            toast.error(`Error creando cliente: ${error.message}`);
        },
    });
    // const [input, setInput] = useState<CompanyInput>(defaultCompany)

    const [selectedCompany, setSelectedCompany] = useState<number>(-1);
    const [input, setInput] = useState<ClientInput>(defaultClient);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (selectedCompany === -1) {
            setError("Por favor selecciona una empresa");
            return;
        }

        try {
            const parsedInput = {
                ...input,
                company_id: selectedCompany,
            };

            await createClient.mutateAsync(parsedInput);
            onClose();
        } catch (error) {
            console.error("Error creating client:", error);
            setError("Error creando cliente");
        }
    }

    const handleInputChange = (key: keyof ClientInput, value: string) => {
        setInput((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            {isLoading ? (
                <Spinner />
            ) : (
                <>
                    <div className="text-xl font-semibold mb-4">
                        Nuevo Cliente
                    </div>
                    {error && (
                        <div className="text-red-500 text-sm mb-2">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="px-2 pt-4 pb-5">
                        <div className="flex flex-col gap-3">
                            <Field label="Nombre" value={input.firstname} required onChange={(val: string) => handleInputChange("firstname", val)} isEditing={true} />
                            <Field label="Apellido" value={input.lastname} required onChange={(val: string) => handleInputChange("lastname", val)} isEditing={true} />
                            <Field label="Email" value={input.email} required onChange={(val: string) => handleInputChange("email", val)} isEditing={true} />
                            <div>
                                <div className="font-normal pt-1 pb-1">
                                    Empresa
                                </div>
                                <select
                                    value={selectedCompany}
                                    className="border w-full rounded px-2 py-1"
                                    onChange={(e) => {
                                        setSelectedCompany(parseInt(e.target.value));
                                    }}
                                >
                                    <option value={-1} key={-1} >Selecciona una empresa</option>
                                    {companies?.map((company) => (
                                        <option key={company.id} value={company.id}>
                                            {company.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-row gap-4 pt-8">
                            <button onClick={onClose} className="flex-1 w-full bg-bg-dark text-text px-3 py-1 rounded hover:bg-bg-extradark transition-colors">
                                Cancelar
                            </button>
                            <button className="flex-1 bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition-colors">
                                Guardar
                            </button>
                        </div>
                    </form>
                </>
            )}
        </Modal>
    )
}

export default NewClientModal;