interface FieldProps {
    label: string;
    value: string | number | undefined | null;
    isEditing?: boolean;
    strong?: boolean;
}

const Field = ({ label, value, isEditing, strong }: FieldProps) => {
    return (
        <div className="flex flex-col">
            <div className={`${strong ? "font-semibold pb-1" : "font-normal"}`}>
                {label}
            </div>
            {isEditing ? (
                <input
                    type="text"
                    defaultValue={value ?? ""}
                    className="bg-bg-dark text-text-light px-3 py-0 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
            ) : (
                <div className="text-text-light">
                    {value}
                </div>

            )}
        </div>
    )
}

export default Field;