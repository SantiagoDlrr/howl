'use client';

import { useState } from 'react';

interface SlidingChatPanelProps {
  question: string;
  callIds: string[];
  onQuestionChange: (question: string) => void;
  onAddCallId: (callId: string) => void;
  onRemoveCallId: (callId: string) => void;
  onSubmitQuestion: () => void;
}

const SlidingChatPanel = ({
  question,
  callIds,
  onQuestionChange,
  onAddCallId,
  onRemoveCallId,
  onSubmitQuestion
}: SlidingChatPanelProps) => {
  const [callIdInput, setCallIdInput] = useState('');

  const handleAddCallId = () => {
    if (callIdInput.trim()) {
      onAddCallId(callIdInput.trim());
      setCallIdInput('');
    }
  };

  const addSampleCallId = (callId: string) => {
    onAddCallId(callId);
  };

  const useQuestion = (sampleQuestion: string) => {
    onQuestionChange(sampleQuestion);
  };

  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Input</h2>
      </div>
      
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="mb-6">
          <label htmlFor="question" className="block mb-2 font-medium text-gray-700">
            Question:
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
            placeholder="Enter your question here..."
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500"
            rows={4}
          />
        </div>
        
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">
            Call IDs:
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={callIdInput}
              onChange={(e) => setCallIdInput(e.target.value)}
              placeholder="Enter call ID (e.g., 122, 123)"
              className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500"
            />
            <button
              onClick={handleAddCallId}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Add
            </button>
          </div>
          
          <div className="max-h-[150px] overflow-y-auto">
            {callIds.map((callId) => (
              <div 
                key={callId}
                className="flex justify-between items-center p-2 mb-2 bg-red-50 rounded-md text-sm"
              >
                <span>Call {callId}</span>
                <button
                  onClick={() => onRemoveCallId(callId)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-2">Sample Call IDs:</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => addSampleCallId('122')}
              className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1 rounded-md text-sm transition-colors"
            >
              Call 122
            </button>
            <button
              onClick={() => addSampleCallId('123')}
              className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1 rounded-md text-sm transition-colors"
            >
              Call 123
            </button>
            <button
              onClick={() => addSampleCallId('124')}
              className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1 rounded-md text-sm transition-colors"
            >
              Call 124
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-2">Sample Questions:</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => useQuestion("What was the customer's issue with their order?")}
              className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1 rounded-md text-sm transition-colors"
            >
              Order Issue
            </button>
            <button
              onClick={() => useQuestion("How did the agent help with the printer setup?")}
              className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1 rounded-md text-sm transition-colors"
            >
              Printer Setup
            </button>
            <button
              onClick={() => useQuestion("What was the order number mentioned in the call?")}
              className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1 rounded-md text-sm transition-colors"
            >
              Order Number
            </button>
            <button
              onClick={() => useQuestion("What should the customer do if they don't receive their order?")}
              className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1 rounded-md text-sm transition-colors"
            >
              Follow-up Action
            </button>
          </div>
        </div>
        
        <button
          onClick={onSubmitQuestion}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Submit Question
        </button>
      </div>
    </div>
  );
};

export default SlidingChatPanel;