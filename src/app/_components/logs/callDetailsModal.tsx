import React from 'react';
import { X, MessageSquare, ListChecks, SmilePlus, HeartPulse, ArrowRightLeft, AlertTriangle, FileText } from 'lucide-react';
import type { CallLogEntry } from '@/app/utils/types/callLogTypes';
import { ReportSection } from '../main/reportSection';

interface CallDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  callLog: CallLogEntry;
}

const CallDetailsModal: React.FC<CallDetailsModalProps> = ({ isOpen, onClose, callLog }) => {
  if (!isOpen) return null;

  // Función para manejar el click en el backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header del Modal */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {callLog.tittle || 'Detalles de la Llamada'}
            </h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>Fecha: {new Date(callLog.callDate).toLocaleDateString()}</span>
              <span>Duración: 2:16 min</span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                callLog.rating === 'Positive' ? 'bg-green-100 text-green-800' :
                callLog.rating === 'Mid' ? 'bg-blue-100 text-blue-800' :
                callLog.rating === 'Mid2' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {callLog.rating}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Contenido del Modal */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Información del Cliente */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-800 mb-2">Información del Cliente</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Cliente:</span>
                <span className="ml-2 font-medium">
                  {callLog.clientFirstName && callLog.clientLastName
                    ? `${callLog.clientFirstName} ${callLog.clientLastName}`
                    : callLog.client}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Empresa:</span>
                <span className="ml-2 font-medium">{callLog.clientCompany}</span>
              </div>
              <div>
                <span className="text-gray-500">Categoría:</span>
                <span className="ml-2 font-medium">{callLog.category}</span>
              </div>
            </div>
          </div>

          {/* Secciones del Reporte */}
          <div className="space-y-4">
            {/* Retroalimentación */}
            {callLog.feedback && (
              <ReportSection
                title="Retroalimentación"
                icon={<MessageSquare className="w-5 h-5 text-primary" />}
                content={callLog.feedback}
              />
            )}

            {/* Temas Clave */}
            {callLog.keyTopics && callLog.keyTopics.length > 0 && (
              <ReportSection
                title="Temas Clave"
                icon={<ListChecks className="w-5 h-5 text-primary" />}
                listItems={callLog.keyTopics}
              />
            )}

            {/* Emociones */}
            {callLog.emotions && callLog.emotions.length > 0 && (
              <ReportSection
                title="Emociones"
                icon={<SmilePlus className="w-5 h-5 text-primary" />}
                listItems={callLog.emotions}
              />
            )}

            {/* Sentimiento */}
            {callLog.sentiment && (
              <ReportSection
                title="Sentimiento de la llamada"
                icon={<HeartPulse className="w-5 h-5 text-primary" />}
                content={callLog.sentiment}
              />
            )}

            {/* Resultado */}
            {callLog.output && (
              <ReportSection
                title="Resultado"
                icon={<ArrowRightLeft className="w-5 h-5 text-primary" />}
                content={callLog.output}
              />
            )}

            {/* Palabras de Riesgo */}
            {callLog.riskWords && callLog.riskWords.length > 0 && (
              <ReportSection
                title="Palabras de Riesgo"
                icon={<AlertTriangle className="w-5 h-5 text-primary" />}
                listItems={callLog.riskWords}
              />
            )}

            {/* Resumen */}
            {callLog.summary && (
              <ReportSection
                title="Resumen"
                icon={<FileText className="w-5 h-5 text-primary" />}
                content={callLog.summary}
              />
            )}
          </div>
        </div>

        {/* Footer del Modal (opcional) */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallDetailsModal;