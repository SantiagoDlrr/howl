import Field from "../field";
import Modal from "./modal";

interface NewCompanyModalProps {
    isOpen: boolean;
    onClose: () => void;
}
const NewCompanyModal = ({ isOpen, onClose }: NewCompanyModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="text-xl font-semibold mb-4">
                Nueva Empresa
            </div>
            <div className="px-2 pt-4 pb-5">
                {/* <div className="font-normal text-lg pb-3 ">
                Información General
                </div> */}
                <div className="flex flex-col gap-3">
                    <Field strong label="Nombre" value={""} isEditing={true} />
                </div>
                <div className="font-semibold pb-3 pt-8">
                    Dirección
                </div>
                <div className="flex flex-col gap-3">
                    <Field label="País" value={""} isEditing={true} />
                    <Field label="Estado" value={""} isEditing={true} />
                    <Field label="Ciudad" value={""} isEditing={true} />
                    <Field label="Calle" value={""} isEditing={true} />
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
        </Modal>
    )
}

export default NewCompanyModal;