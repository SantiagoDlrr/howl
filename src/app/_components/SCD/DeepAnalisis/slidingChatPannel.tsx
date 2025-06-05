// slidingChatPannel.tsx
'use client';

import { useState } from 'react';
import { Plus, Zap, MessageCircle, Hash, Send } from 'lucide-react';

interface SlidingChatPanelProps {
  question: string;
  callIds: string[];
  onQuestionChange: (question: string) => void;
  onAddCallId: (callId: string) => void;
  onRemoveCallId: (callId: string) => void;
  onSubmitQuestion: () => void;
}

const SlidingChatPanel = ({
  question = '',
  callIds = [],
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

  const addLatestCall = () => {
    onAddCallId('163');
  };

  const handleQuestionSelect = (sampleQuestion: string) => {
    onQuestionChange(sampleQuestion);
  };

  const predefinedQuestions = [
    {
      text: "What was the issue solved in this call?",
      label: "Issue Resolution",
      icon: "🎯"
    },
    {
      text: "Was the issue resolved?",
      label: "Resolution Status", 
      icon: "✅"
    },
    {
      text: "What was the takeaway from this call?",
      label: "Key Insights",
      icon: "💡"
    }
  ];

  return (
    <div className="flex-1 lg:max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-5 bg-gradient-to-r from-[#B351FF] to-[#9d44e8] text-white">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6" />
          <div>
            <h2 className="text-xl font-semibold">Call Analysis</h2>
            <p className="text-purple-100 text-sm">Ask questions about your recordings</p>
          </div>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto space-y-6">
        {/* Question Input */}
        <div className="space-y-3">
          <label htmlFor="question" className="block text-sm font-semibold text-gray-900">
            Your Question
          </label>
          <div className="relative">
            <textarea
              id="question"
              value={question}
              onChange={(e) => onQuestionChange(e.target.value)}
              placeholder="What would you like to know about the call?"
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B351FF]/20 focus:border-[#B351FF] transition-all resize-none bg-gray-50/50"
              rows={4}
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white px-2 py-1 rounded-md">
              {question?.length || 0} chars
            </div>
          </div>
        </div>

        {/* Predefined Questions */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#B351FF]" />
            Quick Questions
          </h3>
          <div className="grid gap-3">
            {predefinedQuestions.map((q, index) => (
              <button
                key={index}
                onClick={() => handleQuestionSelect(q.text)}
                className="p-4 bg-gradient-to-r from-gray-50 to-purple-50/50 hover:from-purple-50 hover:to-purple-100 border border-gray-200 hover:border-[#B351FF]/30 rounded-xl transition-all duration-200 text-left group hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg">{q.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900 mb-1 group-hover:text-[#B351FF] transition-colors">
                      {q.label}
                    </div>
                    <div className="text-sm text-gray-600">{q.text}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Call IDs Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Hash className="w-4 h-4 text-[#B351FF]" />
            Call IDs ({callIds.length})
          </h3>
          
          {/* Add Call ID */}
          <div className="flex gap-3">
            <input
              type="text"
              value={callIdInput}
              onChange={(e) => setCallIdInput(e.target.value)}
              placeholder="Enter call ID (e.g., 122, 123)"
              className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B351FF]/20 focus:border-[#B351FF] transition-all bg-gray-50/50"
            />
            <button
              onClick={handleAddCallId}
              className="bg-[#B351FF] hover:bg-[#9d44e8] text-white font-medium px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 hover:shadow-lg hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          {/* Latest Call Button */}
          <button
            onClick={addLatestCall}
            className="w-full p-3 bg-gradient-to-r from-[#B351FF] to-[#9d44e8] hover:from-[#9d44e8] hover:to-[#8b3dd9] text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.02]"
          >
            <Zap className="w-4 h-4" />
            Add Latest Call
          </button>

          {/* Call IDs List */}
          {callIds && callIds.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {callIds.map((callId) => (
                <div
                  key={callId}
                  className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-xl border border-purple-200/50 group"
                >
                  <span className="font-medium text-gray-900 flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#B351FF] rounded-full"></div>
                    Call {callId}
                  </span>
                  <button
                    onClick={() => onRemoveCallId(callId)}
                    className="text-gray-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-all duration-200"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={onSubmitQuestion}
          disabled={!question?.trim() || !callIds?.length}
          className="w-full bg-gradient-to-r from-[#B351FF] to-[#9d44e8] hover:from-[#9d44e8] hover:to-[#8b3dd9] disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 hover:shadow-lg hover:scale-[1.02] disabled:scale-100 disabled:shadow-none"
        >
          <Send className="w-5 h-5" />
          {!question?.trim() || !callIds?.length 
            ? "Enter question & call IDs to analyze" 
            : "Analyze Calls with AI"
          }
        </button>
      </div>
    </div>
  );
};

export default SlidingChatPanel;
