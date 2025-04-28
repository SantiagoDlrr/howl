"use client";
import { api } from "@/trpc/react";
import Field from "../field";
import Modal from "./modal";
import Spinner from "../../spinner";
import { useState } from "react";
import { company } from "@prisma/client";

interface NewClientModalProps {
    isOpen: boolean;
    onClose: () => void;
}
const NewClientModal = ({ isOpen, onClose }: NewClientModalProps) => {
    const { data: companies, isLoading } = api.company.getAll.useQuery();
    const [selectedCompany, setSelectedCompany] = useState<number>(-1);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            {isLoading ? (
                <Spinner />
            ) : (
                <>
                    <div className="text-xl font-semibold mb-4">
                        Nuevo Cliente
                    </div>
                    <div className="px-2 pt-4 pb-5">
                        <div className="flex flex-col gap-3">
                            <Field label="Nombre" value={""} isEditing={true} />
                            <Field label="Apellido" value={""} isEditing={true} />
                            <Field label="Email" value={""} isEditing={true} />
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
                                    <option value={-1} key={-1} selected>Selecciona una empresa</option>
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
                    </div>
                </>
            )}
        </Modal>
    )
}

export default NewClientModal;