import { useState } from "react";

export function useUploadFlow() {
  const [modalOpen, setModalOpen] = useState(false);
  const [fileContent, setFileContent] = useState<string | null>(null);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleFileUpload = (text: string) => {
    setFileContent(text);
    closeModal();
  };

  return {
    modalOpen,
    openModal,
    closeModal,
    fileContent,
    handleFileUpload,
  };
}