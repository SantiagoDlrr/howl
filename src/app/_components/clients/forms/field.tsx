
interface FieldProps {
    label: string;
    value: string | number | undefined | null;
    onChange?: (e: string) => void;
    isEditing?: boolean;
    required?: boolean;
    strong?: boolean;
}

// one page Plan
// reporte de pruebas

// por sprint
// one page plan 
// pruebas que implementamos(mapeado)
// Ejecucion de las pruebas
// Unit testing
// Prioridad e impacto 
// 

const Field = ({ label, value, isEditing, strong, required, onChange }: FieldProps) => {
    const handleInputChange = (e: string) => {
        if (onChange) {
            onChange(e);
        }
    }

    return (
        <div className="flex flex-col">
            <div className={`${strong ? "font-semibold pb-1" : "font-normal"}`}>
                {label}
            </div>
            {isEditing ? (
                <input
                    type="text"
                    required={required}
                    defaultValue={value ?? ""}
                    onChange={(e) => {
                       handleInputChange(e.target.value);
                    }}
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