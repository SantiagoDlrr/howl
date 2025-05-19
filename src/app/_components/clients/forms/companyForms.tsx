import type { CompanyInput } from "@/app/utils/types/companyInput"
import Field from "./field"

interface CompanyFormsProps {
    input: CompanyInput,
    isEditing?: boolean,
    handleAddressFieldChange: (key: keyof CompanyInput["address"], value: string) => void;
}
const CompanyForms = ({ input, isEditing, handleAddressFieldChange }: CompanyFormsProps) => {
    return (
        <div>
            <div className="font-semibold pb-3">
                Dirección
            </div>
            <div className="flex flex-col gap-3">
                <Field data-cy="company-country" label="País" value={input.address.country} isEditing={isEditing} onChange={(val: string) => handleAddressFieldChange("country", val)} />
                <Field data-cy="company-state" label="Estado" value={input.address.state} isEditing={isEditing} onChange={(val: string) => handleAddressFieldChange("state", val)} />
                <Field data-cy="company-city" label="Ciudad" value={input.address.city} isEditing={isEditing} onChange={(val: string) => handleAddressFieldChange("city", val)} />
                <Field data-cy="company-street" label="Calle" value={input.address.street} isEditing={isEditing} onChange={(val: string) => handleAddressFieldChange("street", val)} />
            </div>
        </div>
    )
}

export default CompanyForms;