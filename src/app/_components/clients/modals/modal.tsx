import { X } from "lucide-react";

interface ModalProps {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
}

const Modal = ({ children, isOpen, onClose, ...props }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div {...props} className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-500">
                    <X className="w-5 h-5 m-2" />
                </button>
                {children}
            </div>
        </div>
    );
}

export default Modal;