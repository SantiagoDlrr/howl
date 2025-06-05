'use client';

import { useState, useEffect } from "react";
import { ResizablePanel } from "howl/app/_components/main/panels/resizablePanel";
import { CallSideBar } from "howl/app/_components/main/panels/callSidebar";
import { AiAssistant } from "howl/app/_components/main/panels/aiAssistant";
import { EmptyState } from "howl/app/_components/main/emptyState";
import { ReportDisplay } from "@/app/_components/main/panels/reportDisplay";
import { UploadModal } from "@/app/_components/main/uploadModal";
import type { FileData } from "@/app/utils/types/main";
import RestrictedAccess from "@/app/_components/auth/restrictedAccess";
import { useSession } from "next-auth/react";
import { RecordModal } from "@/app/_components/main/recordModal";
import NewCallModal from "@/app/_components/main/newCallModal";
// import { generateDummyFiles } from "howl/app/_components/main/dummyData/dummyFiles"; // We can remove or keep

export default function MainPage() {
  const MAX_STORED_FILES = 10; // Set maximum number of files to store

  // Initialize state from sessionStorage if available
  const [files, setFiles] = useState<FileData[]>(() => {
    if (typeof window !== 'undefined') {
      const savedFiles = sessionStorage.getItem('howlx-files');
      return savedFiles ? JSON.parse(savedFiles) : [];
    }
    return [];
  });

  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(() => {
    if (typeof window !== 'undefined') {
      const savedIndex = sessionStorage.getItem('howlx-selected-index');
      return savedIndex ? JSON.parse(savedIndex) : null;
    }
    return null;
  });

  // Save to sessionStorage whenever files change, keeping only the most recent MAX_STORED_FILES
  useEffect(() => {
    if (typeof window !== 'undefined' && files.length > 0) {
      // Only keep the most recent files
      const recentFiles = files.slice(-MAX_STORED_FILES);
      sessionStorage.setItem('howlx-files', JSON.stringify(recentFiles));

      // If selectedFileIndex is out of bounds after trimming, adjust it
      if (selectedFileIndex !== null && selectedFileIndex >= recentFiles.length) {
        setSelectedFileIndex(recentFiles.length - 1);
      }
    }
  }, [files, selectedFileIndex]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('howlx-selected-index', JSON.stringify(selectedFileIndex));
    }
  }, [selectedFileIndex]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showNewCallModal, setShowNewCallModal] = useState(false);

  const [leftPanelWidth, setLeftPanelWidth] = useState(253);
  const [rightPanelWidth, setRightPanelWidth] = useState(300);

  const handleUploadModalOpen = () => setShowUploadModal(true);
  const handleRecordModalOpen = () => setShowRecordModal(true);
  const handleNewCallModalOpen = () => setShowNewCallModal(true);
  const closeUploadModal = () => setShowUploadModal(false);
  const closeRecordingModal = () => setShowRecordModal(false);
  const closeNewCallModal = () => setShowNewCallModal(false);

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

      // http://localhost:443/upload
      // Adjust the URL as needed: if backend is on another port or domain
      const response = await fetch("https://howlx.adriangaona.dev/upload", {
        method: "POST",
        body: formData
      });
      console.log("Response from server:", response);
      if (!response.ok) {
        throw new Error(`Failed to upload file: ${response.status} ${response.statusText}`);
      }

      // The backend already sends JSON shaped like our FileData interface
      const data = await response.json() as FileData;

      // Insert the newly returned FileData, keeping only the most recent MAX_STORED_FILES
      setFiles((prev) => {
        const updated = [...prev, data];
        const trimmed = updated.length > MAX_STORED_FILES ?
          updated.slice(-MAX_STORED_FILES) : updated;

        // Automatically select the newly added file
        setSelectedFileIndex(trimmed.length - 1);
        return trimmed;
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Check console for details.");
    } finally {
      closeUploadModal(); // Hide the modal even if there's an error
      closeRecordingModal();
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
    <div className="h-screen flex justify-center items-stretch bg-gray-50 overflow-hidden">
      {/* Historial de llamadas */}
      <ResizablePanel
        width={leftPanelWidth}
        minWidth={253}
        maxWidth={300}
        side="left"
        onResize={setLeftPanelWidth}
      >
        <CallSideBar
          files={files}
          selectedFileIndex={selectedFileIndex}
          onSelectFile={setSelectedFileIndex}
          onAddNewFile={handleNewCallModalOpen}
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
            file={files[selectedFileIndex]!}
            type={files[selectedFileIndex]?.type ?? ""} />

        ) : (
          <EmptyState onUpload={handleUploadModalOpen} onRecord={handleRecordModalOpen} />
        )}
      </main>
      {/* Asistente de IA */}
      <ResizablePanel
        width={rightPanelWidth}
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
      {showUploadModal && <UploadModal onClose={closeUploadModal} onUpload={completeUpload} />}
      {showRecordModal && <RecordModal onClose={closeRecordingModal} onUpload={completeUpload} />}
      {showNewCallModal && <NewCallModal onClose={closeNewCallModal} onUpload={handleUploadModalOpen} onRecord={handleRecordModalOpen} />}
    </div>
  );
}
