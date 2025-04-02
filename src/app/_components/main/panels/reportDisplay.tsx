'use client'

import React, { useState, useEffect} from 'react';
import {
  FileText,
  MessageSquare,
  ListChecks,
  SmilePlus,
  HeartPulse,
  ArrowRightLeft,
  AlertTriangle,
  Edit2,
  Check
} from 'lucide-react';
import { Report, TranscriptEntry } from 'howl/app/types';
import { ReportSection } from '../reportSection';
import TranscriptSection from '../transcriptSection';

interface Props {
  report: Report;
  transcript: TranscriptEntry[];
  title: string;
  onTitleChange: (newTitle: string) => void;
  type: string;
}
export const ReportDisplay: React.FC<Props> = ({ report, transcript, title, onTitleChange, type }) => {
  const [activeTab, setActiveTab] = useState<'report' | 'transcript'>('report');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [reportTitle, setReportTitle] = useState(title);

  useEffect(() => {
    setReportTitle(title);
  }, [title]);

  const [reportType, setReportType] = useState(type);

  useEffect(() => {
    setReportType(type);
  }, [type]);

  const handleTitleSave = () => {
    setIsEditingTitle(false);
    onTitleChange(reportTitle);
  };

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center">
              {isEditingTitle ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="text-2xl font-semibold text-gray-800 border-b-2 border-primary focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleTitleSave}
                    className="ml-2 p-1 rounded-full hover:bg-gray-100"
                  >
                    <Check className="w-5 h-5 text-primary" />
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-semibold text-gray-800">{reportTitle}</h1>
                  <button
                    onClick={handleTitleEdit}
                    className="ml-2 p-1 rounded-full hover:bg-gray-100"
                  >
                    <Edit2 className="w-4 h-4 text-gray-400" />
                  </button>
                </>
              )}
            </div>

            <div className="mt-2 text-sm text-gray-500">
              <div className="mb-1">Reporte de Llamada: 13 de Marzo</div>
              <div className="mb-1">Duración: 7 min</div>
              <div>
                Calificación de Satisfacción:{' '}
                <span className="bg-gray-200 px-2 py-0.5 rounded-md">80</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <span className="bg-blue-100 text-blue-800 font-medium text-xs px-3 py-1 rounded-full">
              {reportType}
            </span>
            <span className="bg-green-100 text-green-800 font-medium text-xs px-3 py-1 rounded-full">
             {/*Copia lo de arriba del type */}
              Positive
            </span>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-6">
            <button
              className={`py-3 px-1 text-sm font-medium relative ${
                activeTab === 'report'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('report')}
            >
              Report
            </button>
            <button
              className={`py-3 px-1 text-sm font-medium relative ${
                activeTab === 'transcript'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('transcript')}
            >
              Full Transcript
            </button>
          </div>
        </div>

        {activeTab === 'report' ? (
          <div className="space-y-4">
            <ReportSection
              title="Feedback"
              icon={<MessageSquare className="w-5 h-5 text-primary" />}
              content={report.feedback}
            />
            <ReportSection
              title="Temas Clave"
              icon={<ListChecks className="w-5 h-5 text-primary" />}
              listItems={report.keyTopics}
            />
            <ReportSection
              title="Emociones"
              icon={<SmilePlus className="w-5 h-5 text-primary" />}
              listItems={report.emotions}
            />
            <ReportSection
              title="Sentimiento de la llamada"
              icon={<HeartPulse className="w-5 h-5 text-primary" />}
              content={report.sentiment}
            />
            <ReportSection
              title="Output"
              icon={<ArrowRightLeft className="w-5 h-5 text-primary" />}
              content={report.output}
            />
            <ReportSection
              title="Palabras de Riesgo"
              icon={<AlertTriangle className="w-5 h-5 text-primary" />}
              content={report.riskWords}
            />
            <ReportSection
              title="Resumen"
              icon={<FileText className="w-5 h-5 text-primary" />}
              content={report.summary}
            />
          </div>
        ) : (
          <TranscriptSection transcript={transcript} />
        )}
      </div>
    </div>
  );
};