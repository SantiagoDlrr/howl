// DAContainer.tsx
'use client';
import { useEffect, useState } from 'react';
import SlidingChatPanel from './slidingChatPannel';
import RagResponsePanel from './ragResponsePannel';
import { MessageSquare, Sparkles } from 'lucide-react';
import type { FileData, Report, TranscriptEntry } from '@/app/utils/types/main';


interface Source {
  call_id: string;
  text: string;
  score: number;
}

interface ResponseData {
  answer: string;
  sources: Source[];
}

const DAContainer = () => {
  const [callIds, setCallIds] = useState<string[]>([]);
  const [question, setQuestion] = useState('');
  const [responseData, setResponseData] = useState<ResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // NEW STATE: To hold the list of available calls from sessionStorage
  const [availableCallsFromContext, setAvailableCallsFromContext] = useState<{ id: string; name: string }[]>([]);

  // Load saved data from localStorage and sessionStorage on component mount
  useEffect(() => {
    // Load DAContainer's specific data from localStorage
    const savedCallIds = localStorage.getItem('ragChatCallIds');
    const savedResponse = localStorage.getItem('ragChatResponse');
    const savedQuestion = localStorage.getItem('ragChatQuestion');

    if (savedCallIds) {
      setCallIds(JSON.parse(savedCallIds));
    }

    if (savedResponse) {
      setResponseData(JSON.parse(savedResponse));
    }

    if (savedQuestion) {
      setQuestion(savedQuestion);
    }

    // NEW: Load files (calls) from MainPage's sessionStorage
    if (typeof window !== 'undefined') { // Ensure running in a browser environment
      const savedFiles = sessionStorage.getItem('howlx-files');
      if (savedFiles) {
        try {
          const filesData: FileData[] = JSON.parse(savedFiles);
          // Map FileData to the format expected by SlidingChatPanel: { id: string, name: string }
          const mappedCalls = filesData.map(file => ({
            id: file.id.toString(), // Convert number ID to string
            name: file.name
          }));
          setAvailableCallsFromContext(mappedCalls);
        } catch (e) {
          console.error("Failed to parse 'howlx-files' from sessionStorage:", e);
          // Optionally clear corrupted data or handle gracefully
          // sessionStorage.removeItem('howlx-files');
        }
      }
    }
  }, []); // Empty dependency array means this runs once on mount

  // Update localStorage when DAContainer's data changes
  useEffect(() => {
    localStorage.setItem('ragChatCallIds', JSON.stringify(callIds));
  }, [callIds]);

  useEffect(() => {
    if (responseData) {
      localStorage.setItem('ragChatResponse', JSON.stringify(responseData));
    }
  }, [responseData]);

  useEffect(() => {
    localStorage.setItem('ragChatQuestion', question);
  }, [question]);

  const handleAddCallId = (callId: string) => {
    // Optional: You might want to validate if the callId exists in `availableCallsFromContext`
    // to prevent adding arbitrary IDs if that's a requirement.
    if (callId && !callIds.includes(callId)) {
      setCallIds([...callIds, callId]);
    }
  };

  const handleRemoveCallId = (callId: string) => {
    setCallIds(callIds.filter(id => id !== callId));
  };

  const handleSubmitQuestion = async () => {
    if (!question) {
      setError("Please enter a question.");
      return;
    }

    if (callIds.length === 0) {
      setError("Please add at least one call ID.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const requestData = {
      question: question,
      // call_ids: callIds // This array contains the string IDs for your API
      call_ids: ['198']// This array contains the string IDs for your API

    };

    try {
      const response = await fetch('https://howlx.adriangaona.dev/rag_chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      setResponseData(data);
    } catch (error) {
      setError(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-[#B351FF] to-[#9d44e8] rounded-2xl shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#B351FF] to-[#9d44e8] bg-clip-text text-transparent">
              AI Q&A
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Ask intelligent questions about your call recordings and get instant cited insights with a RAG powered AI
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)] min-h-[700px]">
          <SlidingChatPanel
            question={question}
            callIds={callIds}
            onQuestionChange={setQuestion}
            onAddCallId={handleAddCallId}
            onRemoveCallId={handleRemoveCallId}
            onSubmitQuestion={handleSubmitQuestion}
            availableCalls={availableCallsFromContext} // Pass the data from sessionStorage
          />

          <RagResponsePanel
            responseData={responseData}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default DAContainer;