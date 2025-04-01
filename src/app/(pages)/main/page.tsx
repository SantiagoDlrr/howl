'use client';

import { useState } from "react";
import {ResizablePanel} from "howl/app/_components/main/panels/resizablePanel";
import { CallSideBar } from "howl/app/_components/main/panels/callSidebar";
import { aiAssistant as AiAssistant } from "howl/app/_components/main/panels/aiAssistant";
import { EmptyState } from "howl/app/_components/main/emptyState";
import { ReportDisplay } from "howl/app/_components/main/panels/reportDisplay";
import { UploadModal } from "howl/app/_components/main/upload";
import { FileData } from "howl/app/types";

export default function MainPage() {
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState<FileData[]>([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null);
  const [leftPanelWidth, setLeftPanelWidth] = useState(300);
  const [rightPanelWidth, setRightPanelWidth] = useState(300);

  const handleUpload = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const completeUpload = () => {
    const newFile: FileData = {
      id: Date.now(),
      name: 'Reporte de Llamada',
      date: new Date().toLocaleDateString(),
      type: 'Soporte Técnico',
      duration: '7 min',
      rating: 80,
      report: {
        feedback:
          'El agente fue cordial, pero en lugar de validar el cargo inmediatamente, generó una solicitud de revisión que tomó 48 horas.',
        keyTopics: [
          'Facturación incorrecta y cargos inesperados.',
          'Revisión de cargos y transparencia en la facturación.',
        ],
        emotions: [
          '1. Cliente inicia con frustración leve.',
          '2. Se mantiene cooperativo durante la llamada.',
          '3. Finaliza con tranquilidad tras recibir una solución.',
        ],
        sentiment:
          'Neutral - Positivo: La interacción comenzó con tensión pero finalizó con una percepción positiva gracias a la claridad del agente.',
        output:
          'El problema sigue sin resolverse completamente, pero se inició una revisión formal. Se espera respuesta en 48 horas.',
      },
    };

    setFiles((prev) => [...prev, newFile]);
    setSelectedFileIndex(files.length);
    closeModal();
  };

  const getDisplayedReport = () => {
    if (selectedFileIndex === null || !files.length) return null;
    return files[selectedFileIndex]?.report;
  };

  return (
    <div className="h-[calc(100vh-73px)] flex justify-center items-stretch pt-20 bg-gray-50 overflow-hidden">
      {/* Historial de llamadas */}
      <ResizablePanel
        initialWidth={leftPanelWidth}
        minWidth={200}
        maxWidth={400}
        side="left"
        onResize={setLeftPanelWidth}
      >
        <CallSideBar
          files={files}
          selectedFileIndex={selectedFileIndex}
          onSelectFile={setSelectedFileIndex}
          onAddNewFile={handleUpload}
        />
      </ResizablePanel>

      {/* Área principal */}
      <main className="flex-1 overflow-y-auto">
        {selectedFileIndex !== null && files.length > 0 ? (
          <ReportDisplay report={getDisplayedReport()!} />
        ) : (
          <EmptyState onUpload={handleUpload} />
        )}
      </main>

      {/* Asistente de IA */}
      <ResizablePanel
        initialWidth={rightPanelWidth}
        minWidth={200}
        maxWidth={400}
        side="right"
        onResize={setRightPanelWidth}
      >
      <AiAssistant />
      </ResizablePanel>

      {/* Modal de carga */}
      {showModal && <UploadModal onClose={closeModal} onUpload={completeUpload} />}
    </div>
  );
}