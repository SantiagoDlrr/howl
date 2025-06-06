// reportDisplay.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';

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

interface Props {
  report: Report;
  file: FileData;
  transcript: TranscriptEntry[];
  title: string;
  onTitleChange: (newTitle: string) => void;
  type: string;
}

/* -------------------------------------------------------------------------- */
/*                               Helper                                       */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*  Helper: robust duration → seconds                                         */
/* -------------------------------------------------------------------------- */
const parseDurationToSeconds = (
  durationStr: string | number | undefined
): number => {
  /* already a number ------------------------------------------------------ */
  if (typeof durationStr === 'number') return durationStr;

  /* guard against empty / non-string ------------------------------------- */
  if (typeof durationStr !== 'string' || durationStr.trim() === '') return 0;

  const parts = durationStr.split(':');

  if (parts.length === 3) {
    /* HH:MM:SS */
    const hours   = parseInt(parts[0] ?? '0', 10); // ← fallback string
    const minutes = parseInt(parts[1] ?? '0', 10);
    const seconds = parseInt(parts[2] ?? '0', 10);
    return hours * 3600 + minutes * 60 + seconds;
  }

  if (parts.length === 2) {
    /* MM:SS */
    const minutes = parseInt(parts[0] ?? '0', 10);
    const seconds = parseInt(parts[1] ?? '0', 10);
    return minutes * 60 + seconds;
  }

  /* try plain integer (seconds) ------------------------------------------ */
  const candidate = parseInt(durationStr, 10);
  return isNaN(candidate) ? 0 : candidate;
};


/* -------------------------------------------------------------------------- */
/*                               Component                                    */
/* -------------------------------------------------------------------------- */

export const ReportDisplay: React.FC<Props> = ({
  report,
  file,
  transcript,
  title,
  onTitleChange,
  type
}) => {
  const [activeTab, setActiveTab] = useState<'report' | 'transcript'>('report');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [reportTitle, setReportTitle] = useState(title);
  const [isDownloading, setIsDownloading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const [selectedClient, setSelectedClient] = useState<string>('');
  const [selectedCompany, setSelectedCompany] = useState<string>('');

  /* Queries ---------------------------------------------------------------- */
  const { data: clients } = api.companyClient.getAll.useQuery();
  const { data: companies } = api.company.getAll.useQuery();
  const { data: consultant_id } = api.user.getConsultantId.useQuery();

  /* State derived from queries -------------------------------------------- */
  const [filteredClients, setFilteredClients] = useState<
    typeof clients | undefined
  >(undefined);

  /* Mutation -------------------------------------------------------------- */
  const createCall = api.calls.createCall.useMutation({
    onSuccess: async (data) => {
      const callResult = await data.result;
      toast.success(
        `Llamada ${callResult.name || 'sin nombre'} ${data.message}`
      );
    },
    onError: (error) => {
      toast.error(`Error creando llamada: ${error.message}`);
    }
  });

  /* Effects ---------------------------------------------------------------- */
  useEffect(() => {
    if (clients) {
      const newFiltered = clients.filter((c) =>
        selectedCompany ? c.company?.name === selectedCompany : true
      );
      setFilteredClients(newFiltered);
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

  /* Helpers ---------------------------------------------------------------- */
  const getClientId = () => {
    if (!clients) return -1;
    const target = clients.find(
      (c) => `${c.firstname} ${c.lastname}` === selectedClient
    );
    return target ? target.id : -1;
  };

  /* Handlers --------------------------------------------------------------- */
  const handleTitleSave = () => {
    setIsEditingTitle(false);
    onTitleChange(reportTitle);
  };

  const handleSave = () => {
    if (!selectedClient || !selectedCompany) {
      setError('Por favor selecciona una empresa y un cliente');
      return;
    }
    if (!consultant_id || consultant_id === -1) {
      setError('Error: usuario no identificado como consultor');
      return;
    }

    setError(null);

    const clientId = getClientId();
    const parsedDate = new Date(file.date);
    const date = !isNaN(parsedDate.getTime()) ? parsedDate : new Date();

    const payload = {
      name: reportTitle,
      satisfaction: 10,
      duration: parseDurationToSeconds(file?.duration), // FIX: accepts undefined
      summary: report.summary,
      date,
      main_ideas: report.keyTopics,
      type: reportType,
      consultant_id,
      client_id: clientId,
      feedback: report.feedback,
      sentiment_analysis: report.sentiment,
      risk_words: report.riskWords,
      output: report.output,
      diarized_transcript: file.transcript
    };

    /* Debug -------------------------------------------------------------- */
    // console.log('➜ payload.duration', payload.duration);
    createCall.mutate(payload);
  };

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;
    setIsDownloading(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = contentRef.current;

      /* clone so we can strip form controls -------------------------------- */
      const cloned = element.cloneNode(true) as HTMLElement;
      cloned.querySelectorAll('button, select, input').forEach((n) => n.remove());

      /* add header --------------------------------------------------------- */
      const header = document.createElement('div');
      header.innerHTML = `
        <h1 style="font-size:24px;font-weight:bold;margin-bottom:8px;color:#111827;">
          ${reportTitle}
        </h1>
        <p style="font-size:14px;color:#6b7280;margin-bottom:12px;">
          ${activeTab === 'report' ? 'Reporte de Llamada' : 'Transcripción Completa'}
          &nbsp;–&nbsp;Generado el ${new Date().toLocaleDateString('es-MX')}
        </p>
        <div style="font-size:12px;color:#6b7280;margin-bottom:24px;">
          <div>Fecha de llamada: ${file?.date ?? '—'}</div>
          <div>Duración: ${file?.duration ?? '—'}</div>
          <div>Tipo: ${reportType}</div>
          <div>Sentimiento: ${report?.sentiment ?? '—'}</div>
        </div>
        <hr style="margin-bottom:24px;border:0;border-top:1px solid #e5e7eb;">
      `;
      cloned.insertBefore(header, cloned.firstChild);

      /* generate ----------------------------------------------------------- */
      const opt = {
        margin: 0.75,
        filename: `${reportTitle.replace(/[^a-z0-9]/gi, '_')}_${activeTab}_${new Date()
          .toISOString()
          .split('T')[0]}.pdf`,
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

      await html2pdf().set(opt).from(cloned).save();
      toast.success('PDF descargado exitosamente');
    } catch (err) {
      console.error('Error generating PDF', err);
      toast.error('Error al generar el PDF. Por favor intenta de nuevo.');
    } finally {
      setIsDownloading(false);
    }
  };

  /* ---------------------------------------------------------------------- */
  /*                             JSX                                         */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="flex-1 p-6 bg-gray-50 border border-t">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* ------------------------------------------------ Title + Pills -- */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            {isEditingTitle ? (
              <>
                <input
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
              </>
            ) : (
              <>
                <h1 className="text-2xl font-semibold text-gray-800">
                  {reportTitle}
                </h1>
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="ml-2 p-1 rounded-full hover:bg-gray-100"
                >
                  <Edit2 className="w-4 h-4 text-gray-400" />
                </button>
              </>
            )}
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

        {/* ------------------------------------------------ Form + Actions -- */}
        <div className="flex flex-row justify-between">
          <div>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            {/* ----------------------------- Empresa ------------------------ */}
            <div className="flex items-center gap-3 pb-4 pt-3">
              <span className="w-20">Empresa:</span>
              {companies ? (
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="">Seleccionar empresa</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="border rounded px-2 py-1">Aún no hay empresas</div>
              )}
            </div>

            {/* ----------------------------- Cliente ------------------------ */}
            <div className="flex items-center gap-3 pb-6">
              <span className="w-20">Cliente:</span>
              {filteredClients ? (
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="">Seleccionar cliente</option>
                  {filteredClients.map((cl) => (
                    <option
                      key={cl.id}
                      value={`${cl.firstname} ${cl.lastname}`}
                    >
                      {cl.firstname} {cl.lastname}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="border rounded px-2 py-1">Aún no hay clientes</div>
              )}
            </div>

            {/* ----------------------------- Buttons ----------------------- */}
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
                title={`Descargar ${
                  activeTab === 'report' ? 'reporte' : 'transcripción'
                } como PDF`}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium
                  bg-purple-600 text-white rounded-lg transition-all
                  ${
                    isDownloading
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-purple-700 hover:shadow-md active:scale-95'
                  }
                `}
              >
                <Download size={14} />
                {isDownloading ? 'Generando…' : 'PDF'}
              </button>
            </div>
          </div>

          {/* ----------------------------- Meta block ---------------------- */}
          <div className="flex flex-col">
            <div className="mt-2 text-sm text-gray-500">
              <div className="mb-1">Reporte de Llamada: {file?.date ?? '—'}</div>
              <div className="mb-1">Duración: {file?.duration ?? '—'}</div>
              <div>
                Calificación de Satisfacción:{' '}
                <span className="bg-gray-200 px-2 py-0.5 rounded-md">
                  {report?.rating ?? '—'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------ Tabs ------------ */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab('report')}
              className={`
                py-3 px-1 text-sm font-medium relative
                ${
                  activeTab === 'report'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }
              `}
            >
              Report
            </button>
            <button
              onClick={() => setActiveTab('transcript')}
              className={`
                py-3 px-1 text-sm font-medium relative
                ${
                  activeTab === 'transcript'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }
              `}
            >
              Full Transcript
            </button>
          </div>
        </div>

        {/* ------------------------------------------------ Main Content ---- */}
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
