//index.tsx new code
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Header from './aicomponents/layout/Header'
import Sidebar from './aicomponents/layout/Sidebar';
import UploadBox from './aicomponents/ui/UploadBox';
import ProcessingStatus from './aicomponents/ui/ProcessingStatus';
import TranscriptResults from './aicomponents/transcription/TranscriptResults';
import AssistantPanel from './aicomponents/ui/AssistantPanel';
import { TranscriptData, ChatMessage, Call } from './types/types'
export default function Home() {
  // State management for uploads
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);

  // Processing steps state
  const [currentStep, setCurrentStep] = useState<string>('');
  const [processingHistory, setProcessingHistory] = useState<string[]>([]);
  const stepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Transcript data state
  const [transcriptData, setTranscriptData] = useState<TranscriptData | null>(null);
  
  // Chat states
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  
  // Call listing states
  const [calls, setCalls] = useState<Call[]>([]);
  const [hasItems, setHasItems] = useState<boolean>(false);
  const [selectedCallId, setSelectedCallId] = useState<number | null>(null);

  // Function to update processing step with delay
  const updateProcessingStep = (step: string) => {
    // Clear any existing timer
    if (stepTimerRef.current) {
      clearTimeout(stepTimerRef.current);
    }
    
    // Set the current step immediately and add to history
    setCurrentStep(step);
    setProcessingHistory(prev => [...prev, step]);
    
    // Set a timer to ensure this step stays visible for at least 1 second
    stepTimerRef.current = setTimeout(() => {
      stepTimerRef.current = null;
    }, 1000);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stepTimerRef.current) {
        clearTimeout(stepTimerRef.current);
      }
    };
  }, []);

  // Load calls from API on initial load
  useEffect(() => {
    // This would be a real API call in production
    // Here we'll simulate having no calls initially and then getting one after upload
    setHasItems(calls.length > 0);
  }, [calls]);

  // Handle file selection
  const handleFileChange = (file: File) => {
    setAudioFile(file);
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setAudioFile(e.dataTransfer.files[0]!);
    }
  };

  // Upload the audio and read SSE chunked responses
  const handleUpload = async () => {
    if (!audioFile) {
      alert('Please select an audio file first.');
      return;
    }

    try {
      setUploading(true);
      setCurrentStep('');
      setProcessingHistory([]);
      setTranscriptData(null); // reset final data

      const formData = new FormData();
      formData.append('file', audioFile);

      // POST to the SSE endpoint
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok || !response.body) {
        throw new Error(`Upload SSE error. Status: ${response.status}`);
      }

      // Manually read the streamed body
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let partialChunk = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break; // finished reading

        // Decode the chunk into text
        partialChunk += decoder.decode(value, { stream: true });
        // We split on double-newline to separate SSE "events"
        const parts = partialChunk.split('\n\n');
        // Keep the last partial piece in partialChunk
        partialChunk = parts.pop() || '';

        // Process each complete SSE event
        for (let sseMessage of parts) {
          // Remove the leading "data: " (if present)
          const cleaned = sseMessage.replace(/^data:\s?/, '');
          try {
            // Try parsing as JSON (final results)
            const obj = JSON.parse(cleaned);
            setTranscriptData(obj);
            
            // Simulate adding a new call to the list
            const newCall: Call = {
              id: obj.id || Date.now(),
              title: "Facturación Incorrecta",
              date: "13 de Marzo",
              duration: "7 min",
              category: "Soporte Técnico",
              rating: 80,
              path: `/calls/${obj.id}`,
              selected: true
            };
            
            setCalls(prev => [...prev, newCall]);
            setSelectedCallId(newCall.id);
            setHasItems(true);
            
            updateProcessingStep('Analysis complete!');
          } catch {
            // If not JSON, treat it as a status update
            updateProcessingStep(cleaned);
          }
        }
      }
    } catch (err) {
      console.error('Error uploading file (SSE):', err);
      alert('Something went wrong. Check console for details.');
      updateProcessingStep(`Error: ${err}`);
    } finally {
      setUploading(false);
      if (stepTimerRef.current) {
        clearTimeout(stepTimerRef.current);
        stepTimerRef.current = null;
      }
    }
  };

  // Send a chat message
  const handleSendChatMessage = async (message: string) => {
    if (!transcriptData) {
      alert('No transcript to reference. Upload a file first.');
      return;
    }
    if (!message.trim()) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: message.trim(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setUserInput('');

    try {
      setChatLoading(true);
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript_id: transcriptData.id,
          messages: updatedMessages,
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat request failed with status ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        const errorMsg: ChatMessage = {
          role: 'assistant',
          content: `Error: ${data.error}`,
        };
        setMessages(prev => [...prev, errorMsg]);
      } else {
        const assistantMsg: ChatMessage = {
          role: 'assistant',
          content: data.assistant_message || 'No response',
        };
        setMessages(prev => [...prev, assistantMsg]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        role: 'assistant',
        content: `Error: ${err}`,
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  // Handle call selection
  const handleCallSelect = (callId: number) => {
    setSelectedCallId(callId);
    
    // Usually this would fetch call data from the backend
    // For now we'll just use the transcriptData we already have
  };

  // Handle adding a new call (open upload modal)
  const handleAddNewCall = () => {
    // Reset states to simulate a new call upload
    setTranscriptData(null);
    setAudioFile(null);
    setSelectedCallId(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header userName="Hector, RDZ" userRole="Admin" />
      
      <div className="flex flex-1">
        {/* Left sidebar */}
        <Sidebar 
          hasItems={hasItems} 
          calls={calls}
          selectedCallId={selectedCallId}
          onCallSelect={handleCallSelect}
          onAddNewCall={handleAddNewCall}
        />
        
        {/* Main content area */}
        <main className="flex-1 border-r border-gray-200">
          {hasItems && selectedCallId ? (
            /* Call analysis view - shown when a call is selected */
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium">Análisis de llamada</h2>
                <div className="flex space-x-4">
                  <button className="text-purple-600 hover:text-purple-800">Exportar</button>
                  <button className="text-purple-600 hover:text-purple-800">Compartir</button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {transcriptData && (
                  <TranscriptResults
                    data={transcriptData}
                  />
                )}
              </div>
            </div>
          ) : (
            /* Upload view - shown when no call is selected or no calls exist */
            <div className="flex flex-col h-full items-center justify-center p-4">
              <div className="w-full max-w-lg text-center">
                {!hasItems && (
                  <h2 className="text-xl font-bold mb-2">¡Bienvenido a HowIX!</h2>
                )}
                
                <div 
                  className={`
                    bg-white rounded-xl border-2 border-dashed ${
                      dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
                    } 
                    p-8 mb-6
                  `}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center justify-center my-8">
                    <div className="text-purple-500 mb-4">
                      <svg className="w-16 h-16 mx-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-medium text-purple-600 mb-2">Analiza y Transcribe tu archivo</h3>
                    <p className="text-gray-500">Arrastra o haz click para cargar</p>
                    
                    <input 
                      type="file" 
                      id="fileInput" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleFileChange(e.target.files[0]!);
                        }
                      }} 
                      accept="audio/*,video/*"
                    />
                  </div>
                </div>
                
                {audioFile && (
                  <div className="mt-4 space-y-4">
                    <div className="p-3 bg-gray-100 rounded-lg text-sm">
                      <div className="font-medium">{audioFile.name}</div>
                      <div className="text-gray-500">{(audioFile.size / (1024 * 1024)).toFixed(2)} MB</div>
                    </div>
                    
                    <button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                    >
                      {uploading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Procesando...
                        </div>
                      ) : 'Analizar grabación'}
                    </button>
                  </div>
                )}
                
                {currentStep && (
                  <ProcessingStatus currentStep={currentStep} />
                )}
              </div>
            </div>
          )}
        </main>
        
        {/* Right panel - AI Assistant */}
        <AssistantPanel 
          onSendMessage={handleSendChatMessage}
          messages={messages}
          userInput={userInput}
          setUserInput={setUserInput}
          loading={chatLoading}
          transcriptAvailable={!!transcriptData}
        />
      </div>
    </div>
  );
}