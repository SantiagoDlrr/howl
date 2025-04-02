// 'use client';

// import { useState } from "react";
// import { ResizablePanel } from "howl/app/_components/main/panels/resizablePanel";
// import { CallSideBar } from "howl/app/_components/main/panels/callSidebar";
// import { aiAssistant as AiAssistant } from "howl/app/_components/main/panels/aiAssistant";
// import { EmptyState } from "howl/app/_components/main/emptyState";
// import { ReportDisplay } from "howl/app/_components/main/panels/reportDisplay";
// import { UploadModal } from "howl/app/_components/main/upload";
// import { FileData } from "howl/app/types";
// import { generateDummyFiles } from "howl/app/_components/main/dummyData/dummyFiles";

// const USE_DUMMY_DATA = true;

// export default function MainPage() {
//   const [showModal, setShowModal] = useState(false);
//   const [files, setFiles] = useState<FileData[]>(USE_DUMMY_DATA ? generateDummyFiles() : []);
//   const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(
//     USE_DUMMY_DATA ? 0 : null
//   );
//   const [leftPanelWidth, setLeftPanelWidth] = useState(253);
//   const [rightPanelWidth, setRightPanelWidth] = useState(300);

//   const handleUpload = () => setShowModal(true);
//   const closeModal = () => setShowModal(false);

//   const completeUpload = (file: File) => {
//     const newFile: FileData = {
//       id: files.length + 1,
//       name: file.name,
//       date: new Date().toLocaleDateString(),
//       type: 'Sin categoría',
//       duration: '0 min',
//       rating: 0,
//       report: {
//         feedback: 'Procesando...',
//         keyTopics: [],
//         emotions: [],
//         sentiment: 'Pendiente',
//         output: '',
//         riskWords: '',
//         summary: '',
//       },
//       transcript: [],
//     };

//     setFiles((prev) => {
//       const updated = [...prev, newFile];
//       setSelectedFileIndex(updated.length - 1);
//       return updated;
//     });

//     closeModal();

//     // Si quieres subir el archivo real al backend, aquí iría:
//     /*
//     const formData = new FormData();
//     formData.append("audio", file);

//     fetch("/api/upload", {
//       method: "POST",
//       body: formData,
//     })
//       .then(res => res.json())
//       .then(data => {
//         // Puedes actualizar el reporte o transcripción aquí
//       })
//       .catch(err => console.error("Error al subir archivo", err));
//     */
//   };

//   const getDisplayedReport = () => {
//     if (selectedFileIndex === null || !files.length) return null;
//     return files[selectedFileIndex]?.report;
//   };

//   const getDisplayedTranscript = () => {
//     if (selectedFileIndex === null || !files.length) return [];
//     return files[selectedFileIndex]?.transcript || [];
//   };

//   const updateFileName = (index: number, newName: string) => {
//     setFiles(prevFiles => {
//       const fileToUpdate = prevFiles[index];
//       if (!fileToUpdate || typeof fileToUpdate.id !== 'number') return prevFiles;

//       const updatedFile: FileData = {
//         ...fileToUpdate,
//         name: newName,
//       };

//       const updatedFiles = [...prevFiles];
//       updatedFiles[index] = updatedFile;

//       return updatedFiles;
//     });
//   };

//   return (
//     <div className="h-[calc(100vh-73px)] flex justify-center items-stretch pt-16 bg-gray-50 overflow-hidden">
//       {/* Historial de llamadas */}
//       <ResizablePanel
//         initialWidth={leftPanelWidth}
//         minWidth={253}
//         maxWidth={300}
//         side="left"
//         onResize={setLeftPanelWidth}
//       >
//         <CallSideBar
//           files={files}
//           selectedFileIndex={selectedFileIndex}
//           onSelectFile={setSelectedFileIndex}
//           onAddNewFile={handleUpload}
//         />
//       </ResizablePanel>

//       {/* Área principal */}
//       <main className="flex-1 overflow-y-auto">
//         {selectedFileIndex !== null && files.length > 0 ? (
//           <ReportDisplay
//             report={getDisplayedReport()!}
//             transcript={getDisplayedTranscript()}
//             title={files[selectedFileIndex]?.name ?? ''}
//             onTitleChange={(newTitle) => updateFileName(selectedFileIndex, newTitle)}
//             type={files[selectedFileIndex]?.type ?? ''}
//           />
//         ) : (
//           <EmptyState onUpload={handleUpload} />
//         )}
//       </main>

//       {/* Asistente de IA */}
//       <ResizablePanel
//         initialWidth={rightPanelWidth}
//         minWidth={200}
//         maxWidth={400}
//         side="right"
//         onResize={setRightPanelWidth}
//       >
//         <AiAssistant />
//       </ResizablePanel>

//       {/* Modal de carga */}
//       {showModal && <UploadModal onClose={closeModal} onUpload={completeUpload} />}
//     </div>
//   );
// }


'use client';

import { useState } from "react";
import { ResizablePanel } from "howl/app/_components/main/panels/resizablePanel";
import { CallSideBar } from "howl/app/_components/main/panels/callSidebar";
import { aiAssistant as AiAssistant } from "howl/app/_components/main/panels/aiAssistant";
import { EmptyState } from "howl/app/_components/main/emptyState";
import { ReportDisplay } from "howl/app/_components/main/panels/reportDisplay";
import { UploadModal } from "howl/app/_components/main/upload";
import { FileData } from "howl/app/types";
// import { generateDummyFiles } from "howl/app/_components/main/dummyData/dummyFiles"; // We can remove or keep

export default function MainPage() {
  const [showModal, setShowModal] = useState(false);

  // Start empty or with dummy data:
  const [files, setFiles] = useState<FileData[]>([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null);

  const [leftPanelWidth, setLeftPanelWidth] = useState(253);
  const [rightPanelWidth, setRightPanelWidth] = useState(300);

  const handleUploadModalOpen = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  /**
   * Actually performs the POST to the backend.
   */
  const completeUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Adjust the URL as needed: if backend is on another port or domain
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData
      });
      if (!response.ok) {
        throw new Error(`Failed to upload file: ${response.status} ${response.statusText}`);
      }

      // The backend already sends JSON shaped like our FileData interface
      const data: FileData = await response.json();

      // Insert the newly returned FileData at the end of the array
      setFiles((prev) => {
        const updated = [...prev, data];
        // Automatically select the newly added file
        setSelectedFileIndex(updated.length - 1);
        return updated;
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Check console for details.");
    } finally {
      closeModal(); // Hide the modal even if there's an error
    }
  };

  // If you want a separate callback that you pass to <UploadModal onUpload={...}/>, do so:
  const handleFileUpload = (file: File) => {
    completeUpload(file);
  };

  // Retrieve the currently displayed report or transcript
  const getDisplayedReport = () => {
    if (selectedFileIndex === null || !files.length) return null;
    return files[selectedFileIndex]?.report;
  };

  const getDisplayedTranscript = () => {
    if (selectedFileIndex === null || !files.length) return [];
    return files[selectedFileIndex]?.transcript || [];
  };

  const updateFileName = (index: number, newName: string) => {
    setFiles((prevFiles) => {
      const fileToUpdate = prevFiles[index];
      if (!fileToUpdate) return prevFiles;

      const updatedFile: FileData = {
        ...fileToUpdate,
        name: newName,
      };

      const updatedFiles = [...prevFiles];
      updatedFiles[index] = updatedFile;
      return updatedFiles;
    });
  };

  return (
    <div className="h-[calc(100vh-73px)] flex justify-center items-stretch pt-16 bg-gray-50 overflow-hidden">
      {/* Historial de llamadas */}
      <ResizablePanel
        initialWidth={leftPanelWidth}
        minWidth={253}
        maxWidth={300}
        side="left"
        onResize={setLeftPanelWidth}
      >
        <CallSideBar
          files={files}
          selectedFileIndex={selectedFileIndex}
          onSelectFile={setSelectedFileIndex}
          onAddNewFile={handleUploadModalOpen}
        />
      </ResizablePanel>

      {/* Área principal */}
      <main className="flex-1 overflow-y-auto">
        {selectedFileIndex !== null && files.length > 0 ? (
          <ReportDisplay
            report={getDisplayedReport()!}
            transcript={getDisplayedTranscript()}
            title={files[selectedFileIndex]?.name ?? ""}
            onTitleChange={(newTitle) => updateFileName(selectedFileIndex, newTitle)}
            type={files[selectedFileIndex]?.type ?? ""}
          />
        ) : (
          <EmptyState onUpload={handleUploadModalOpen} />
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
      {showModal && <UploadModal onClose={closeModal} onUpload={handleFileUpload} />}
    </div>
  );
}
