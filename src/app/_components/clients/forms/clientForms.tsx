import { ClientInput } from "@/app/utils/types/clientInput";
import Field from "./field";
import { company } from "@prisma/client";

interface ClientFormsProps {
    input: ClientInput;
    companies: company[] | undefined;
    selectedCompany: number;
    isEditing?: boolean;
    handleInputChange: (key: keyof ClientInput, value: string) => void;
    setSelectedCompany: (id: number) => void;
}
const ClientForms = ({input, isEditing, companies, selectedCompany, setSelectedCompany, handleInputChange} : ClientFormsProps) => {
    return (
        <div className="flex flex-col gap-3">
            <Field label="Nombre" value={input.firstname} required onChange={(val: string) => handleInputChange("firstname", val)} isEditing={isEditing} />
            <Field label="Apellido" value={input.lastname} required onChange={(val: string) => handleInputChange("lastname", val)} isEditing={isEditing} />
            <Field label="Email" value={input.email} required onChange={(val: string) => handleInputChange("email", val)} isEditing={isEditing} />
            <div>
                <div className="font-normal pt-1 pb-1">
                    Empresa
                </div>
                {isEditing ? (
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
                ) : (
                    <div className="text-text-light">
                        {companies?.find((company) => company.id === selectedCompany)?.name}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ClientForms;