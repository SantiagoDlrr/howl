interface FormFieldProps {
    label: string;
    type?: string;
    xl?: boolean;
}

const FormField = ({ label, type, xl }: FormFieldProps) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            <div>
                {label}
            </div>
            <input type="text" className={`bg-bg-dark rounded-md px-2 w-full`} />
        </div>
    )
}

export default FormField;