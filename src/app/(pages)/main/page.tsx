'use client';

import { useState } from "react";
import { ResizablePanel } from "howl/app/_components/main/panels/resizablePanel";
import { CallSideBar } from "howl/app/_components/main/panels/callSidebar";
import { AiAssistant } from "howl/app/_components/main/panels/aiAssistant";
import { EmptyState } from "howl/app/_components/main/emptyState";
import { ReportDisplay } from "howl/app/_components/main/panels/reportDisplay";
import { UploadModal } from "@/app/_components/main/uploadModal";
import type { FileData } from "@/app/utils/types/main";
import RestrictedAccess from "@/app/_components/auth/restrictedAccess";
import { useSession } from "next-auth/react";
import { RecordModal } from "@/app/_components/main/recordModal";
import NewCallModal from "@/app/_components/main/newCallModal";
// import { generateDummyFiles } from "howl/app/_components/main/dummyData/dummyFiles"; // We can remove or keep

export default function MainPage() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showNewCallModal, setShowNewCallModal] = useState(false);

  // Start empty or with dummy data:
  const [files, setFiles] = useState<FileData[]>([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null);

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

      // First, upload the file to the processing service
      const response = await fetch("https://app.howlx.run.place:443/upload", {
      // const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData
      });
      if (!response.ok) {
        throw new Error(`Failed to upload file: ${response.status} ${response.statusText}`);
      }

      // Get the processed data from the upload service
      const data = await response.json() as FileData;

      // Now send the processed data to our database API
      const dbResponse = await fetch("/api/call-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          // Add required IDs - you'll need to get these from your app state or context
          consultant_id: 1, // Replace with actual consultant ID
          client_id: 1,     // Replace with actual client ID
          name: file.name,  // Use the original filename
          // Make sure these required fields exist
          report_data: data.report || {}, // Ensure report_data exists
          full_transcript_text: data.transcript ? 
            data.transcript.map(t => t.text).join(' ') : '', // Create full text from transcript
        }),
      });

      if (!dbResponse.ok) {
        const errorData = await dbResponse.json();
        console.error("Database storage error:", errorData);
        // Continue with UI update even if DB storage fails
      } else {
        const dbResult = await dbResponse.json();
        console.log("Call data stored in database with ID:", dbResult.callId);
        
        // You could update the data object with the database ID if needed
        // data.dbId = dbResult.callId;
      }

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
      {showUploadModal && <UploadModal onClose={closeUploadModal} onUpload={completeUpload} />}
      {showRecordModal && <RecordModal onClose={closeRecordingModal} onUpload={completeUpload} />}
      {showNewCallModal && <NewCallModal onClose={closeNewCallModal} onUpload={handleUploadModalOpen} onRecord={handleRecordModalOpen} />}
    </div>
  );
}
