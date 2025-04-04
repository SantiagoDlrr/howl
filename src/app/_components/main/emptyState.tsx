import React from 'react';
import { Upload } from 'lucide-react';

interface Props {
  onUpload: () => void;
}

export const EmptyState: React.FC<Props> = ({ onUpload }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-6 border-t border">
      <div className="text-center max-w-md w-full">
        <h2 className="text-2xl font-semibold text-purple-600 mb-4">¡Bienvenido a HowlX!</h2>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center mb-6">
          <div className="mb-4 bg-purple-100 p-4 rounded-full">
            <Upload className="w-8 h-8 text-purple-500" />
          </div>
          <h3 className="text-xl font-medium text-purple-600 mb-2">Analiza y Transcribe tu archivo</h3>
          <p className="text-gray-500 mb-4">Arrastra o haz clic para cargar</p>

          <button
            onClick={onUpload}
            className="py-2 px-4 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
          >
            Cargar archivo
          </button>
        </div>

        <p className="text-gray-500 text-sm">
          Aún no tienes ninguna llamada cargada
        </p>
      </div>
    </div>
  );
};