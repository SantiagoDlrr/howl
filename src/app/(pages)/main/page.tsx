'use client';

import { useState } from "react";
import {ResizablePanel} from "howl/app/_components/main/panels/resizablePanel";
import { CallSideBar } from "howl/app/_components/main/panels/callSidebar";
import { aiAssistant as AiAssistant } from "howl/app/_components/main/panels/aiAssistant";
import { EmptyState } from "howl/app/_components/main/emptyState";
import {ReportDisplay} from "howl/app/_components/main/panels/reportDisplay";
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
          riskWords:
            'El problema aún no ha sido completamente resuelto, ya que el cargo sigue reflejado en la cuenta del cliente y está pendiente la validación de su procedencia. Sin embargo, se ha iniciado una solicitud formal de revisión, lo que representa un paso hacia la solución definitiva. Se espera que en un plazo de 48 horas se brinde una respuesta final, ya sea confirmando la validez del cobro o procesando el ajuste correspondiente. En caso de que la revisión confirme que el cargo fue indebido, se procederá con un reembolso o ajuste en la facturación del cliente.',
          summary:
            'El cliente contactó el servicio de soporte debido a un cargo inesperado en su factura, expresando preocupación por un posible error en la activación de un servicio adicional. El agente revisó la cuenta y confirmó que el cobro correspondía a un servicio activado el mes anterior, aunque el cliente afirmó no haber solicitado dicha activación. Para resolver la situación, el agente generó una solicitud de revisión que tomará hasta 48 horas en procesarse, brindando al cliente instrucciones claras sobre el seguimiento de su caso. Aunque el problema no se resolvió de inmediato, el cliente recibió la información necesaria y finalizó la llamada con una actitud más tranquila y confiada en el proceso. Sin embargo, queda pendiente la resolución final y el ajuste en la facturación en caso de que se determine un error.',
        },
        transcript: [ // ← directo aquí, no dentro de report
            { speaker: 'Alex', text: 'Good morning! This is Alex calling from Quick Tech Solutions. How are you doing today?' },
            { speaker: 'Jamie', text: 'Hi Alex, I’m doing well, thank you. What can I do for you?' },
            { speaker: 'Alex', text: 'That’s wonderful to hear, Jamie!...' },
            { speaker: 'Jamie', text: 'That sounds really interesting. Can you tell me more about the features?' },
            { speaker: 'Alex', text: 'Absolutely! For instance, our smart thermostat...' },
          ]
      };

      // TODO: Reemplazar transcript hardcodeado con el resultado real del backend cuando se procese el audio

    setFiles((prev) => [...prev, newFile]);
    setSelectedFileIndex(files.length);
    closeModal();
  };

  const getDisplayedReport = () => {
    if (selectedFileIndex === null || !files.length) return null;
    return files[selectedFileIndex]?.report;
  };

  const getDisplayedTranscript = () => {
    if (selectedFileIndex === null || !files.length) return [];
    return files[selectedFileIndex]?.transcript || [];
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
          <ReportDisplay
          report={getDisplayedReport()!}
          transcript={getDisplayedTranscript()}
          />
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