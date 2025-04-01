'use client'

import { useState } from "react";
import UploadModal from "../modals/uploadModal";
import PlaceholderView from "../documentViews/placeHolderView";
import ReportView from "../documentViews/reportView";
import LoadingReport from "../documentViews/loadingReport";

export default function DocumentPanel() {
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reportContent, setReportContent] = useState<string | null>(null);

  const handleUpload = (file: File) => {
    setIsLoading(true);
    setTimeout(() => {
      const fakeTranscript = `El agente atendió la llamada de manera cordial...`;
      setReportContent(fakeTranscript);
      setIsLoading(false);
      setModalOpen(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col flex-[5.8] h-full border-x border-black border-opacity-50">
      <div className="border-b border-black border-opacity-50 p-3 text-center font-bold">
        ¡Bienvenido a HowlX!
      </div>

      <div className="flex-1 overflow-y-auto">
        {reportContent ? (
          <ReportView transcript={reportContent} />
        ) : (
          <PlaceholderView onUploadClick={() => setModalOpen(true)} />
        )}
      </div>

      {modalOpen && (
        <UploadModal
          onClose={() => setModalOpen(false)}
          onUpload={handleUpload}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

// Old version of the document panel layout (moved into comment for reference)
// export default function MainPage() {
//     return (
//         <div className="h-[calc(100vh-73px)] flex justify-center items-stretch pt-20">
//             <CallLog />
//             <div className="flex flex-col flex-[5.8] h-full border-black border-opacity-50 border-t border-b-0 border-r-0 border-l border-2">
//                 <div className="border-black border-opacity-50 border-t-0 border-b border-r-0 border-l-0 border-2 p-3">
//                     Análisis de Llamada
//                 </div>
//                 <div className="flex justify-center items-center flex-1">
//                     <div className="flex flex-col items-center border-black border-opacity-50 border-dashed border-2 py-20 px-24">
//                         <Image src="/images/uploadc.png" alt="Microsoft Logo" width={75} height={50} />
//                         <h1 className="text-4xl font-bold text-primary">
//                             Analiza y Transcribe tu archivo
//                         </h1>
//                         <p className="text-2xl py-3">Arrastra o haz click para cargar</p>
//                     </div>
//                 </div>
//             </div>
//             <div className="border-black border-2 border-opacity-30 flex flex-[2.1] h-full">Ai Asistant</div>
//         </div>
//     );
// }