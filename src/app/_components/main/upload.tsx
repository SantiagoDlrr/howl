import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

interface Props {
  onClose: () => void;
  onUpload: (file: File) => void;
}

export const UploadModal: React.FC<Props> = ({ onClose, onUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      simulateUpload(file);
    }
  };

  const simulateUpload = (file: File) => {
    setUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onUpload(file); // Aquí se envía el archivo real
        }, 500);
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium text-gray-900">Cargar Archivo</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!uploading ? (
          <>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center mb-6">
              <Upload className="w-8 h-8 text-purple-500 mb-4" />
              <p className="text-gray-500 text-center mb-4">Selecciona un archivo de audio</p>
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
                id="fileInput"
              />
              <label htmlFor="fileInput" className="py-2 px-4 bg-purple-500 text-white rounded-md hover:bg-purple-600 cursor-pointer">
                Seleccionar Archivo
              </label>
            </div>
          </>
        ) : (
          <div>
            <p className="text-gray-700 mb-2">Cargando archivo...</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-purple-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-right text-sm text-gray-500 mt-1">{uploadProgress}%</p>
          </div>
        )}
      </div>
    </div>
  );
};