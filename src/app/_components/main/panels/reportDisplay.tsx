'use client'

import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import {
  FileText,
  MessageSquare,
  ListChecks,
  SmilePlus,
  HeartPulse,
  ArrowRightLeft,
  AlertTriangle,
  Edit2,
  Check,
  Download
} from 'lucide-react';
import type { Report, TranscriptEntry, FileData } from '@/app/utils/types/main';
import { ReportSection } from '../reportSection';
import TranscriptSection from '../transcriptSection';
import { api } from '@/trpc/react';
import toast from 'react-hot-toast';

// Type definitions
interface Client {
  id: number;
  firstname: string;
  lastname: string;
  company?: {
    name: string;
  };
}

interface Company {
  id: number;
  name: string;
}

interface CreateCallSuccessResponse {
  result: Promise<{ name: string }>;
  message: string;
}

interface CreateCallError {
  message: string;
}

interface Props {
  report: Report;
  file: FileData;
  transcript: TranscriptEntry[];
  title: string;
  onTitleChange: (newTitle: string) => void;
  type: string;
}

export const ReportDisplay: React.FC<Props> = ({ report, file, transcript, title, onTitleChange, type }) => {
  const [activeTab, setActiveTab] = useState<'report' | 'transcript'>('report');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [reportTitle, setReportTitle] = useState(title);
  const [isDownloading, setIsDownloading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const [selectedClient, setSelectedClient] = useState<string>('');
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const { data: clients } = api.companyClient.getAll.useQuery();
  const { data: companies } = api.company.getAll.useQuery();
  const { data: consultant_id } = api.user.getConsultantId.useQuery();
  const [filteredClients, setFilteredClients] = useState<Client[] | undefined>(clients);

  const [saved, setSaved] = useState(false);

  const createCall = api.calls.createCall.useMutation({
    onSuccess: async (data: CreateCallSuccessResponse) => {
      setSaved(true);
      toast.success(`Llamada ${(await data.result).name} ${data.message}`);
    },
    onError: (error: CreateCallError) => {
      setSaved(false);
      toast.error(`Error creando llamada: ${error.message}`);
    },
  })

  useEffect(() => {
    if (clients) {
      const filtered = clients.filter((client: Client) => {
        if (selectedCompany) {
          return client.company?.name === selectedCompany;
        }
        return true;
      });
      setFilteredClients(filtered);
    }
  }, [clients, selectedCompany]);

  useEffect(() => {
    setReportTitle(title);
  }, [title]);

  const [reportType, setReportType] = useState(type);
  const [error, setError] = useState<string | null>(null);

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

  const getClientId = () => {
    if (clients) {
      const client = clients.find((client: Client) => {
        const fullName = `${client.firstname} ${client.lastname}`;
        return fullName === selectedClient;
      });
      return client ? client.id : -1;
    }

    return -1;
  }

  const handleSave = () => {
    if (!selectedClient || !selectedCompany) {
      setError("Por favor selecciona una empresa y un cliente");
      return;
    }

    setError(null);

    if (!consultant_id || consultant_id == -1) {
      setError("Error: usuario no identificado como consultor");
      return;
    }

    const clientId = getClientId();
    const parsedDate = new Date(file.date);
    const date = !isNaN(parsedDate.getTime()) ? parsedDate : new Date();
    
    const satisfaction = 10;
    const parsedInput = {
      name: reportTitle,
      satisfaction: satisfaction,
      duration: parseInt(String(file.duration), 10) || 0,
      summary: report.summary,
      date: date,
      main_ideas: report.keyTopics,
      type: reportType,
      consultant_id: consultant_id,
      client_id: clientId,
      feedback: report.feedback,
      sentiment_analysis: report.sentiment,
      risk_words: report.riskWords,
      output: report.output,
      diarized_transcript: file.transcript,
    };

    createCall.mutate(parsedInput);
  }

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;

    setIsDownloading(true);
    
    try {
      const element = contentRef.current;
      
      // Clone and prepare content
      const clonedContent = element.cloneNode(true) as HTMLElement;
      
      // Remove interactive elements from the cloned content
      const buttonsToRemove = clonedContent.querySelectorAll('button, select, input');
      buttonsToRemove.forEach(el => el.remove());
      
      // Add title header to the PDF
      const header = document.createElement('div');
      header.innerHTML = `
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 8px; color: #111827;">${reportTitle}</h1>
        <p style="font-size: 14px; color: #6b7280; margin-bottom: 12px;">
          ${activeTab === 'report' ? 'Reporte de Llamada' : 'Transcripción Completa'} - Generado el ${new Date().toLocaleDateString('es-MX')}
        </p>
        <div style="font-size: 12px; color: #6b7280; margin-bottom: 24px;">
          <div>Fecha de llamada: ${file?.date ?? '—'}</div>
          <div>Duración: ${file?.duration ?? '—'}</div>
          <div>Tipo: ${reportType}</div>
          <div>Sentimiento: ${report?.sentiment ?? '—'}</div>
        </div>
        <hr style="margin-bottom: 24px; border: 0; border-top: 1px solid #e5e7eb;">
      `;
      clonedContent.insertBefore(header, clonedContent.firstChild);
      
      const opt = {
        margin: 0.75,
        filename: `${reportTitle.replace(/[^a-z0-9]/gi, '_')}_${activeTab}_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          letterRendering: true,
          scrollY: -window.scrollY
        },
        jsPDF: { 
          unit: 'in', 
          format: 'letter', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().set(opt).from(clonedContent).save();
      toast.success('PDF descargado exitosamente');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error al generar el PDF. Por favor intenta de nuevo.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 border border-t">
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
          </div>

          <div className="flex items-center space-x-2">
            <span className="bg-blue-100 text-blue-800 font-medium text-xs px-3 py-1 rounded-full">
              {reportType}
            </span>
            <span className="bg-green-100 text-green-800 font-medium text-xs px-3 py-1 rounded-full">
              {report?.sentiment ?? '—'}
            </span>
          </div>
        </div>

        <div className='flex flex-row justify-between'>
          <div>
            {error && (
              <div className="text-red-500 text-sm mb-2">
                {error}
              </div>
            )}
            <div className='flex flex-row items-center gap-3 pb-4 pt-3'>
              <div className='w-20'>
                Empresa:
              </div>
              {companies ? (
                <select
                  value={selectedCompany}
                  onChange={(e) => {
                    setSelectedCompany(e.target.value);
                  }}
                  className="border rounded px-2 py-1"
                >
                  <option value="">Seleccionar empresa</option>
                  {companies.map((company: Company) => (
                    <option key={company.id} value={company.name}>{company.name}</option>
                  ))}
                </select>
              ) : (
                <div className="border rounded px-2 py-1">
                  Aún no hay empresas
                </div>
              )}
            </div>

            <div className='flex flex-row items-center gap-3 pb-6'>
              <div className='w-20'>
                Cliente:
              </div>
              {filteredClients ? (
                <select
                  value={selectedClient}
                  onChange={(e) => {
                    setSelectedClient(e.target.value);
                  }}
                  className="border rounded px-2 py-1"
                >
                  <option value="">Seleccionar cliente</option>
                  {filteredClients.map((client: Client) => (
                    <option key={client.id} value={client.firstname + " " + client.lastname}>{client.firstname + " " + client.lastname}</option>
                  ))}
                </select>
              ) : (
                <div className="border rounded px-2 py-1">
                  Aún no hay clientes
                </div>
              )}
            </div>

            {/* Updated button container with flex layout */}
            <div className="flex items-center gap-3 mb-10">
              <button 
                onClick={handleSave} 
                className="py-2 px-4 bg-primary text-white rounded-md hover:bg-purple-600 text-sm"
              >
                Guardar Llamada
              </button>

              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium
                  bg-purple-600 text-white rounded-lg transition-all
                  ${isDownloading 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-purple-700 hover:shadow-md active:scale-95'
                  }
                `}
                title={`Descargar ${activeTab === 'report' ? 'reporte' : 'transcripción'} como PDF`}
              >
                <Download size={14} />
                {isDownloading ? 'Generando...' : 'PDF'}
              </button>
            </div>
          </div>

          <div className='flex flex-col'>
            <div className="mt-2 text-sm text-gray-500">
              <div className="mb-1">Reporte de Llamada: {file?.date ?? '—'}</div>
              <div className="mb-1">Duración: {file?.duration ?? '—'}</div>
              <div>
                Calificación de Satisfacción:{' '}
                <span className="bg-gray-200 px-2 py-0.5 rounded-md"> {report?.rating ?? '—'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-6">
            <button
              className={`py-3 px-1 text-sm font-medium relative ${activeTab === 'report'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
                }`}
              onClick={() => setActiveTab('report')}
            >
              Report
            </button>
            <button
              className={`py-3 px-1 text-sm font-medium relative ${activeTab === 'transcript'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
                }`}
              onClick={() => setActiveTab('transcript')}
            >
              Full Transcript
            </button>
          </div>
        </div>

        {/* Content to be converted to PDF */}
        <div ref={contentRef}>
          {activeTab === 'report' ? (
            <div className="space-y-4">
              <ReportSection
                title="Retroalimentación"
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
                title="Resultado"
                icon={<ArrowRightLeft className="w-5 h-5 text-primary" />}
                content={report.output}
              />
              <ReportSection
                title="Palabras de Riesgo"
                icon={<AlertTriangle className="w-5 h-5 text-primary" />}
                listItems={report.riskWords}
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
    </div>
  );
};