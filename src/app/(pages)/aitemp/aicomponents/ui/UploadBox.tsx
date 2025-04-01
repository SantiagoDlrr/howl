import React, { useState } from 'react';

interface UploadBoxProps {
  onFileChange: (file: File) => void;
  onUpload: () => void;
  uploading: boolean;
  file: File | null;
}

const UploadBox: React.FC<UploadBoxProps> = ({ onFileChange, onUpload, uploading, file }) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileChange(e.dataTransfer.files[0]!);
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e.target.files[0]!);
    }
  };
  
  return (
    <div 
      className={`
        w-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-10
        ${isDragging ? 'border-purple-500 bg-purple-50' : 'border-purple-200'}
        hover:bg-purple-50 transition-colors cursor-pointer
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('fileInput')?.click()}
    >
      <div className="text-purple-500 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      <h3 className="text-xl font-medium text-purple-600 mb-2">Analiza y Transcribe tu archivo</h3>
      <p className="text-gray-500">Arrastra o haz click para cargar</p>
      
      <input 
        type="file" 
        id="fileInput" 
        className="hidden" 
        onChange={handleFileInput} 
        accept="audio/*,video/*"
      />
    </div>
  );
};

export default UploadBox;