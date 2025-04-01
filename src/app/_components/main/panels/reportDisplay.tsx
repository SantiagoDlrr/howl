import React from 'react';
import { FileText, User } from 'lucide-react';
import { Report } from 'howl/app/types';
import { ReportSection } from '../reportSection';

interface Props {
  report: Report;
}

export const ReportDisplay: React.FC<Props> = ({ report }) => {
  return (
    <div className="flex-1 p-6 bg-white">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Facturación Incorrecta</h1>
          <div className="text-sm text-gray-500">Reporte de Llamada · 13 de Marzo · 7 min</div>
        </div>
        <div className="flex items-center">
          <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">Soporte Técnico</span>
          <div className="ml-4 text-sm">
            <span className="text-gray-500">Calificación:</span>
            <span className="ml-1 font-semibold">80</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <ReportSection
          title="Feedback"
          icon={<User className="w-5 h-5 text-purple-500" />}
          content={report.feedback}
        />
        <ReportSection
          title="Temas Clave"
          icon={<FileText className="w-5 h-5 text-purple-500" />}
          listItems={report.keyTopics}
        />
        <ReportSection
          title="Emociones"
          icon={<User className="w-5 h-5 text-purple-500" />}
          listItems={report.emotions}
        />
        <ReportSection
          title="Sentimiento de la llamada"
          icon={<User className="w-5 h-5 text-purple-500" />}
          content={report.sentiment}
        />
        <ReportSection
          title="Output"
          icon={<User className="w-5 h-5 text-purple-500" />}
          content={report.output}
        />
      </div>
    </div>
  );
};