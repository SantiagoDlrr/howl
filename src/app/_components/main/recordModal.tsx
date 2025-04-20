import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import Recording from './recording';

interface Props {
  onClose: () => void;
  onUpload: (file: File) => void; // The parent will handle the actual POST request
}

export const RecordModal: React.FC<Props> = ({ onClose, onUpload }) => {
  const [uploading, setUploading] = useState(false);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium text-gray-900">Nueva grabación</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!uploading ? (
          <>
           <Recording onUpload={onUpload} setUploading={setUploading} /> 
          </>
        ) : (
          <div>
            <p className="text-gray-700 mb-2">Subiendo grabación...</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-purple-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `100%` }}
              ></div>
            </div>
            <p className="text-right text-sm text-gray-500 mt-1">Procesando...</p>
          </div>
        )}
      </div>
    </div>
  );
};

