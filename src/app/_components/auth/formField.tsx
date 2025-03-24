interface FormFieldProps {
    label: string;
    type?: string;
}

const FormField = ({ label, type }: FormFieldProps) => {
    return (
        <div className="flex flex-col gap-1">
            <div>
                {label}
            </div>
            <input type="text" className="bg-bg-dark rounded-md px-2 min-w-80" />
        </div>
    )
}

export default FormField;