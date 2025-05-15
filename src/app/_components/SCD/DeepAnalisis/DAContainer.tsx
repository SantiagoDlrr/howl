'use client';

import { useEffect, useState } from 'react';
import SlidingChatPanel from './slidingChatPannel';
import RagResponsePanel from './ragResponsePannel';

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

  // Load saved data from localStorage on component mount
  useEffect(() => {
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
  }, []);

  // Update localStorage when data changes
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
    
    // Prepare request data
    const requestData = {
      question: question,
      call_ids: callIds
    };
    
    try {
      // Send request to the API
      const response = await fetch('http://localhost:8000/rag_chat', {
      // Uncomment below for cloud server
      // const response = await fetch('http://https://app.howlx.run.place:443/rag_chat', {
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
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-semibold text-center mb-6">RAG Chat Test Interface</h1>
      
      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-100px)] min-h-[600px]">
        <SlidingChatPanel 
          question={question}
          callIds={callIds}
          onQuestionChange={setQuestion}
          onAddCallId={handleAddCallId}
          onRemoveCallId={handleRemoveCallId}
          onSubmitQuestion={handleSubmitQuestion}
        />
        
        <RagResponsePanel 
          responseData={responseData}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};

export default DAContainer;