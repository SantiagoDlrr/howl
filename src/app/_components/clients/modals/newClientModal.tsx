"use client";
import { api } from "@/trpc/react";
import Modal from "./modal";
import Spinner from "../../spinner";
import { useState } from "react";
import toast from "react-hot-toast";
import { defaultClient } from "@/app/utils/types/clientInput";
import type { ClientInput } from "@/app/utils/types/clientInput";
import ClientForms from "../forms/clientForms";

interface NewClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    setColumnId: (id: number | null) => void;
    setShow: (num: number) => void;
}

const NewClientModal = ({ isOpen, onClose, setColumnId, setShow }: NewClientModalProps) => {
    const { data: companies, isLoading } = api.company.getAll.useQuery();
    const utils = api.useUtils();

    const createClient = api.companyClient.createClient.useMutation({
        onSuccess: async (data) => {
            toast.success(`Cliente ${data.firstname} ${data.lastname} creado`);
            setShow(2);
            setColumnId(data.id);
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
                        <ClientForms
                            input={input}
                            isEditing={true}
                            companies={companies}
                            selectedCompany={selectedCompany}
                            handleInputChange={handleInputChange}
                            setSelectedCompany={setSelectedCompany}
                        />
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