import React from 'react';
import { ChevronUp, User } from 'lucide-react';

export const aiAssistant: React.FC = () => {
  return (
    <div className="bg-white flex flex-col h-full">
      <div className="p-4 border-b border-t border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-800">Asistente Howl AI</h2>
        <div className="h-3 w-3 rounded-full bg-green-400" title="Disponible"></div>
      </div>

      <div className="flex-1 p-4 flex flex-col justify-between">
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
          <div className="bg-purple-100 p-4 rounded-full mb-4">
            <User className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-sm mb-4 max-w-xs">
            Escribe una pregunta y nuestra IA resumirá al instante los puntos clave, recordará detalles, redactará contenido y descubrirá información a partir de la transcripción.
          </p>
        </div>

        <div className="mt-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Pregúntame algo..."
              className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button className="absolute inset-y-0 right-0 flex items-center px-3 text-purple-500">
              <ChevronUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};