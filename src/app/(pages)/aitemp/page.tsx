
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
  const [selectedCallId, setSelectedCallId] = useState<string | number | null>(null); // Allow string for UUID

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
    }, 1000); // Adjust delay if needed
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stepTimerRef.current) {
        clearTimeout(stepTimerRef.current);
      }
    };
  }, []);

  // Update hasItems when calls change
  useEffect(() => {
    setHasItems(calls.length > 0);
  }, [calls]);

  // Handle file selection
  const handleFileChange = (file: File) => {
    setAudioFile(file);
    // Reset previous results when a new file is selected but not yet uploaded
    setTranscriptData(null);
    setCurrentStep('');
    setProcessingHistory([]);
    setMessages([]); // Reset chat too
    setSelectedCallId(null); // Deselect previous call
    setHasItems(calls.length > 0); // Keep existing calls visible until upload starts/completes
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
      // Use handleFileChange to trigger resets etc.
      handleFileChange(e.dataTransfer.files[0]!);
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
      setCurrentStep('Initiating upload...'); // Initial step
      setProcessingHistory(['Initiating upload...']);
      setTranscriptData(null); // Ensure previous data is cleared
      setMessages([]); // Clear chat for new upload

      const formData = new FormData();
      formData.append('file', audioFile);

      // POST to the SSE endpoint
      const response = await fetch('http://localhost:8000/upload', { // Ensure URL is correct
        method: 'POST',
        body: formData,
      });

      if (!response.ok || !response.body) {
         const errorText = await response.text(); // Try to get error details
         throw new Error(`Upload failed. Status: ${response.status}. ${errorText}`);
      }

      // Manually read the streamed body
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let partialChunk = '';
      let completed = false; // Flag to ensure final processing happens once

      while (!completed) {
        const { value, done } = await reader.read();
        if (done) {
           completed = true; // Mark as completed
           // Process any remaining partial chunk after stream ends
           if (partialChunk.trim()) {
             // Attempt to process the last bit
              processSSEChunk(partialChunk);
           }
           break;
        }

        // Decode the chunk into text
        partialChunk += decoder.decode(value, { stream: true });

        // Process complete SSE events within the chunk
        let eventBoundary = partialChunk.indexOf('\n\n');
        while (eventBoundary >= 0) {
            const singleEvent = partialChunk.substring(0, eventBoundary);
            processSSEChunk(singleEvent); // Process the complete event
            partialChunk = partialChunk.substring(eventBoundary + 2); // Remove processed event + delimiter
            eventBoundary = partialChunk.indexOf('\n\n'); // Look for next boundary
        }
      }

      // Final check in case the last message didn't end with \n\n but the stream finished
      if (!completed && partialChunk.trim()) {
          processSSEChunk(partialChunk);
      }


    } catch (err: any) { // Catch any type of error
      console.error('Error uploading file (SSE):', err);
      const errorMsg = err.message || 'An unknown error occurred during upload.';
      updateProcessingStep(`Error: ${errorMsg}`);
      alert(`Something went wrong during upload: ${errorMsg}`);
    } finally {
      setUploading(false);
      // Clear any lingering step timer if process ends early or completes
      if (stepTimerRef.current) {
        clearTimeout(stepTimerRef.current);
        stepTimerRef.current = null;
      }
      // If upload finished but no data came through (e.g., immediate error)
      // ensure the step reflects that failure state didn't get stuck on "Processing"
      if (!transcriptData && !processingHistory.some(step => step.toLowerCase().includes('error'))) {
          if (currentStep === 'Initiating upload...' || currentStep === 'File saved, now transcribing with Whisper...') {
             // Add a generic failure message if it seems stuck early
             // updateProcessingStep("Processing failed or stalled.");
          }
      }
    }
  };

  // Helper function to process a single complete SSE message chunk
  const processSSEChunk = (sseMessage: string) => {
    if (!sseMessage.trim()) return; // Ignore empty messages

    // Remove the leading "data: " prefix, handling potential extra spaces
    const cleaned = sseMessage.replace(/^data:\s*/, '');

    try {
      // Try parsing as JSON
      const obj = JSON.parse(cleaned);

      // --- ** THIS IS THE CORE FIX ** ---
      // Check if this is the final completion message with the 'data' payload
      if (obj && obj.status === 'complete' && obj.data) {
        const finalData: TranscriptData = obj.data; // Extract the nested data object

        console.log("Received final data payload:", finalData);

        // Ensure ID is treated consistently (backend sends UUID string)
        const finalId = finalData.id;

        // Set the state with the CORRECT data structure
        setTranscriptData(finalData);

        // Create the Call object for the sidebar
        const newCall: Call = {
          id: finalId, // Use the ID from the data (should be string UUID)
          title: `Call Analysis - ${finalId.toString().substring(0, 8)}...`, // Example title using ID
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }), // Format date nicely
          duration: "N/A", // Placeholder - Could be calculated or passed from backend if available
          category: finalData.report?.keyTopics?.[0] || "General", // Use first topic or default
          rating: 0, // Placeholder - Could be derived from sentiment/user input
          path: `/calls/${finalId}`, // Dynamic path based on ID
          selected: true // Make the newly added call selected
        };

        // Add to calls list, ensuring no duplicates if upload somehow triggers twice
        setCalls(prev => {
          if (prev.some(call => call.id === newCall.id)) {
            // If call already exists, update it and ensure it's selected
             return prev.map(call => call.id === newCall.id ? { ...newCall, selected: true } : { ...call, selected: false });
          }
          // Deselect old calls and add the new one selected
          return [...prev.map(call => ({ ...call, selected: false })), newCall];
        });

        setSelectedCallId(newCall.id); // Set the selected ID state
        // setHasItems is handled by useEffect watching `calls`

        updateProcessingStep('Analysis complete!'); // Final status update

      } else if (obj && obj.message) {
        // Handle structured status updates {status: "...", message: "..."}
        console.log("Received status update:", obj.status, "-", obj.message);
        updateProcessingStep(obj.message); // Display the message part
      } else {
        // If it parsed as JSON but wasn't the expected structure, log it
        console.warn("Received unexpected JSON structure:", obj);
        // Attempt to display something meaningful, fallback to stringified JSON
        const displayMessage = typeof obj === 'object' ? JSON.stringify(obj) : obj.toString();
        updateProcessingStep(`Received data: ${displayMessage.substring(0, 100)}...`); // Limit length
      }
      // --- ** END OF CORE FIX ** ---

    } catch (e) {
      // If it's not JSON, treat it as a simple status string update
      // Ensure it's not an empty string after cleaning potential whitespace
      if (cleaned.trim()) {
          console.log("Received status string:", cleaned);
          updateProcessingStep(cleaned.trim());
      } else {
          console.log("Received empty or whitespace-only SSE message.");
      }
    }
  };


  // Send a chat message
  const handleSendChatMessage = async (message: string) => {
    if (!transcriptData || !transcriptData.id) { // Check for transcriptData and its id
      alert('No transcript analysis is currently loaded to chat about. Please upload and analyze a file first.');
      return;
    }
    if (!message.trim()) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: message.trim(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setUserInput(''); // Clear input field immediately

    try {
      setChatLoading(true);
      const response = await fetch('http://localhost:8000/chat', { // Ensure URL is correct
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript_id: transcriptData.id, // Pass the transcript ID
          messages: updatedMessages, // Send the whole conversation history
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown chat error' })); // Try to parse error JSON
        throw new Error(`Chat request failed: ${response.status} - ${errorData.detail || response.statusText}`);
      }

      const data = await response.json();
      if (data.error) { // Handle specific error structure if backend sends { "error": "..." }
        const errorMsg: ChatMessage = {
          role: 'assistant',
          content: `Error: ${data.error}`,
        };
        setMessages(prev => [...prev, errorMsg]);
      } else if (data.assistant_message) {
        const assistantMsg: ChatMessage = {
          role: 'assistant',
          content: data.assistant_message,
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
         // Handle cases where the response is successful but might not contain the expected message field
         console.warn("Received unexpected successful chat response:", data);
         const fallbackMsg: ChatMessage = {
           role: 'assistant',
           content: 'Received an unexpected response from the assistant.',
         };
         setMessages(prev => [...prev, fallbackMsg]);
      }
    } catch (err: any) { // Catch any type of error
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        role: 'assistant',
        content: `Error processing chat request: ${err.message || 'Please try again.'}`,
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  // Handle call selection from sidebar
  const handleCallSelect = (callId: number | string) => { // Allow string for UUID
    // Find the call data in the `calls` state
    const selectedCall = calls.find(call => call.id === callId);
    if (selectedCall) {
        // In a real app, you might fetch full details here using the callId if not already loaded
        // fetch(`/api/calls/${callId}`).then(res => res.json()).then(data => setTranscriptData(data));

        // For this example, we assume transcriptData holds the relevant data if the call originated from the current session's upload.
        // If the call list were persistent, you'd need to load the data.
        // We'll just update the selected state.

        // Update the `selected` property on the calls array
        setCalls(prevCalls =>
          prevCalls.map(call =>
            call.id === callId
              ? { ...call, selected: true }
              : { ...call, selected: false }
          )
        );
        setSelectedCallId(callId);

        // **Important**: If selecting an old call for which `transcriptData` is not currently set,
        // you NEED to load it here. For now, we assume `transcriptData` corresponds to the *last uploaded* call.
        // If `transcriptData`'s ID doesn't match `callId`, you might clear it or fetch the correct one.
        if (transcriptData && transcriptData.id !== callId) {
            // Example: Clear data if it doesn't match the selected call
            // setTranscriptData(null);
            // setMessages([]); // Clear chat for the old context
            // alert("Loading data for selected call... (Implementation needed)");
            // Or fetch new data based on callId
        }

    } else {
      console.warn(`Call with ID ${callId} not found in state.`);
    }
  };

  // Handle adding a new call (essentially resets to upload state)
  const handleAddNewCall = () => {
    // Reset states to simulate preparing for a new call upload
    setTranscriptData(null);
    setAudioFile(null);
    setSelectedCallId(null); // Deselect any currently selected call
    setCalls(prevCalls => prevCalls.map(call => ({ ...call, selected: false }))); // Deselect visually in sidebar
    setCurrentStep('');
    setProcessingHistory([]);
    setMessages([]); // Clear chat
    setUploading(false);
    setDragActive(false);
    // hasItems will remain true if there are other calls in the list
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50"> {/* Changed bg slightly */}
      <Header userName="Hector, RDZ" userRole="Admin" /> {/* Props might need adjustment */}

      <div className="flex flex-1 overflow-hidden"> {/* Added overflow-hidden */}
        {/* Left sidebar */}
        <Sidebar
          hasItems={hasItems}
          calls={calls}
          selectedCallId={selectedCallId}
          onCallSelect={handleCallSelect}
          onAddNewCall={handleAddNewCall}
        />

        {/* Main content area */}
        {/* Added overflow-y-auto here for scrolling */}
        <main className="flex-1 border-l border-r border-gray-200 overflow-y-auto">
          {selectedCallId && transcriptData && transcriptData.id === selectedCallId ? (
            /* Call analysis view - shown when a call is selected AND its data is loaded */
            <div className="flex flex-col h-full"> {/* Use h-full if parent has fixed height or flex */}
              <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white sticky top-0 z-10"> {/* Made header sticky */}
                <h2 className="text-lg font-medium text-gray-800">Call Analysis</h2>
                <div className="flex space-x-4">
                  <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">Export</button>
                  <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">Share</button>
                </div>
              </div>

              {/* Added padding here for content */}
              <div className="flex-1 p-4 md:p-6 lg:p-8"> {/* Responsive padding */}
                {transcriptData ? (
                  <TranscriptResults
                    data={transcriptData}
                  />
                ) : (
                  <div className="text-center py-10 text-gray-500">Loading analysis data...</div>
                )}
              </div>
            </div>
          ) : (
            /* Upload view - shown when no call is selected, or selected call data isn't loaded */
            <div className="flex flex-col h-full items-center justify-center p-4">
              <div className="w-full max-w-lg text-center">
                {/* Show welcome message only if there are truly no calls */}
                {!hasItems && !uploading && !currentStep && (
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">¡Bienvenido a HowIX!</h2>
                )}

                 {/* Only show UploadBox if not currently uploading */}
                 {!uploading && (
                     <div
                       className={`
                         bg-white rounded-xl border-2 border-dashed ${
                           dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-gray-400'
                         }
                         p-6 sm:p-8 mb-6 transition-colors duration-200 ease-in-out
                       `}
                       onDragEnter={handleDrag}
                       onDragLeave={handleDrag}
                       onDragOver={handleDrag}
                       onDrop={handleDrop}
                     >
                       <div className="flex flex-col items-center justify-center space-y-4 my-6 sm:my-8">
                         <div className="text-purple-500">
                           {/* Icon SVG */}
                           <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 8V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                         </div>
                         <h3 className="text-xl sm:text-2xl font-medium text-gray-800">Analyze and Transcribe</h3>
                         <p className="text-gray-500 text-sm sm:text-base">Drag & drop or click to upload your audio/video file</p>
                         <label htmlFor="fileInput" className="mt-2 cursor-pointer px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors">
                            Select File
                         </label>
                         <input
                           type="file"
                           id="fileInput"
                           className="hidden"
                           onChange={(e) => {
                             if (e.target.files && e.target.files.length > 0) {
                               handleFileChange(e.target.files[0]!);
                             }
                           }}
                           accept="audio/*,video/*" // Specify accepted file types
                         />
                       </div>
                     </div>
                 )} {/* End of !uploading block */}


                {/* Display selected file info and upload button */}
                {audioFile && !uploading && (
                  <div className="mt-4 space-y-4 w-full">
                    <div className="p-3 bg-gray-100 rounded-lg text-sm border border-gray-200">
                      <div className="font-medium text-gray-700 truncate">{audioFile.name}</div>
                      <div className="text-gray-500 text-xs">{(audioFile.size / (1024 * 1024)).toFixed(2)} MB</div>
                    </div>

                    <button
                      onClick={handleUpload}
                      disabled={uploading} // Disable button while uploading
                      className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                       Analyze Recording
                    </button>
                  </div>
                )}

                {/* Display processing status OR spinner during upload */}
                 {uploading && (
                    <div className="mt-6 text-center w-full">
                        <div className="flex items-center justify-center text-purple-600">
                          <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Processing...</span>
                        </div>
                         {currentStep && (
                            <ProcessingStatus currentStep={currentStep} />
                         )}
                    </div>
                 )}

                 {/* Display final status/error message *after* upload attempt if not showing results */}
                 {!uploading && currentStep && !transcriptData && (
                    <ProcessingStatus currentStep={currentStep} />
                 )}


              </div>
            </div>
          )}
        </main>

        {/* Right panel - AI Assistant */}
        {/* Added overflow-y-auto here and flex-col */}
        <AssistantPanel
          onSendMessage={handleSendChatMessage}
          messages={messages}
          userInput={userInput}
          setUserInput={setUserInput}
          loading={chatLoading}
          // Enable chat only if transcript data for the *selected* call is available
          transcriptAvailable={!!transcriptData && transcriptData.id === selectedCallId}
        />
      </div>
    </div>
  );
}