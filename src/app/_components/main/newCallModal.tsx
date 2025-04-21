import React from 'react';
import { X } from 'lucide-react';
import { EmptyState } from './emptyState';

interface Props {
    onClose: () => void;
    onUpload: () => void; // The parent will handle the actual POST request
    onRecord: () => void; // Function to start recording
}

export const NewCallModal: React.FC<Props> = ({ onClose, onUpload, onRecord }) => {

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-2/3 p-6 relative">
                <button onClick={onClose} className="w-full text-gray-400 hover:text-gray-500 flex flex-row justify-end">
                    <X className="w-5 h-5" />
                </button>
                <EmptyState onUpload={onUpload} onRecord={onRecord} close={onClose}/>
            </div>
        </div>
    );
};


export default NewCallModal;