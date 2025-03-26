interface FormFieldProps {
    label: string;
    type?: string;
    xl?: boolean;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormField = ({ label, type, xl, value, onChange }: FormFieldProps) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            <div>
                {label}
            </div>
            <input type="text" value={value} onChange={onChange} className={`bg-bg-dark rounded-md px-2 w-full`} />
        </div>
    )
}

export default FormField;