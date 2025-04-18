'use client';

import { useState } from "react";
import { ResizablePanel } from "howl/app/_components/main/panels/resizablePanel";
import { CallSideBar } from "howl/app/_components/main/panels/callSidebar";
import { AiAssistant } from "howl/app/_components/main/panels/aiAssistant";
import { EmptyState } from "howl/app/_components/main/emptyState";
import { ReportDisplay } from "howl/app/_components/main/panels/reportDisplay";
import { UploadModal } from "howl/app/_components/main/upload";
import type { FileData } from "@/app/types/main";
import RestrictedAccess from "@/app/_components/auth/restrictedAccess";
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();
  if (!session?.user) {
    return (
      <RestrictedAccess />
    )
  }

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
      const data = await response.json() as FileData;

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
  // const handleFileUpload = (file: File) => {
  //   completeUpload(file);
  // };

  // Retrieve the currently displayed report or transcript
  const getDisplayedReport = () => {
    if (selectedFileIndex === null || !files.length) return null;
    return files[selectedFileIndex]?.report;
  };

  const getDisplayedTranscript = () => {
    if (selectedFileIndex === null || !files.length) return [];
    return files[selectedFileIndex]?.transcript ?? [];
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

  const getMessagesForSelectedFile = () => {
    if (selectedFileIndex === null) return [];
    return files[selectedFileIndex]?.messages ?? [];
  };


  const updateMessagesForFile = (
    fileIndex: number,
    newMessages: { role: "user" | "assistant"; text: string }[]
  ) => {
    setFiles((prev) => {
      const updated = [...prev];

      // Solución defensiva
      if (typeof updated[fileIndex]?.id !== "number") return prev;

      const file: FileData = {
        ...updated[fileIndex],
        messages: newMessages,
      };

      updated[fileIndex] = file;
      return updated;
    });
  };


  return (
    <div className="h-screen flex justify-center items-stretch pt-16 bg-gray-50 overflow-hidden">
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
        <AiAssistant
          selectedFileId={
            selectedFileIndex !== null ? files[selectedFileIndex]?.id ?? null : null
          }
          files={files}
          initialMessages={getMessagesForSelectedFile()}
          onUpdateMessages={(messages) => updateMessagesForFile(selectedFileIndex!, messages)}
        />
      </ResizablePanel>

      {/* Modal de carga */}
      {showModal && <UploadModal onClose={closeModal} onUpload={completeUpload} />}
    </div>
  );
}