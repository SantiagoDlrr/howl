// slidingChatPannel.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Zap, MessageCircle, Hash, Send, Search, Calendar, Building, User, Star } from 'lucide-react';
import type { CallLogEntry } from '@/app/utils/types/callLogTypes';

// Define a type for the call options received from the parent
interface CallOption {
  id: string;
  name: string;
  callDate: string;
  client: string;
  clientCompany: string;
  category: string;
  rating: string;
}

interface SlidingChatPanelProps {
  question: string;
  callIds: string[]; // These are the IDs of calls already selected for analysis
  onQuestionChange: (question: string) => void;
  onAddCallId: (callId: string) => void;
  onRemoveCallId: (callId: string) => void;
  onSubmitQuestion: () => void; // This will trigger the API call in the parent
  availableCalls: CallOption[]; // Latest 5 calls by default
  onSearchCalls: (searchTerm: string) => CallOption[]; // New prop for search functionality
  allCallLogs: CallLogEntry[]; // All call logs for advanced search
}

const SlidingChatPanel = ({
  question = '',
  callIds = [],
  onQuestionChange,
  onAddCallId,
  onRemoveCallId,
  onSubmitQuestion,
  availableCalls = [],
  onSearchCalls,
  allCallLogs = []
}: SlidingChatPanelProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<CallOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        setIsSearching(true);
        const results = onSearchCalls(searchTerm);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearchCalls]);

  const handleQuestionSelect = (sampleQuestion: string) => {
    onQuestionChange(sampleQuestion);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  const predefinedQuestions = [
    {
      text: "What was the issue in this call?",
      label: "Issue Identification",
      icon: "🔍"
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

  // Get the calls to display (search results or default latest 5)
  const callsToDisplay = searchTerm.trim() ? searchResults : availableCalls;

  return (
    <div className="flex-1 lg:max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-5 bg-gradient-to-r from-[#B351FF] to-[#9d44e8] text-white">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6" />
          <div>
            <h2 className="text-xl font-semibold">Q&A Chat</h2>
            <p className="text-purple-100 text-sm">Ask questions about your recordings and receive precise cited answers</p>
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

        {/* Call Search Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Hash className="w-4 h-4 text-[#B351FF]" />
            Search & Select Calls
          </h3>
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by client, company, title, category..."
              className="w-full pl-10 pr-10 p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B351FF]/20 focus:border-[#B351FF] transition-all bg-gray-50/50"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>

          {/* Search Status */}
          {searchTerm && (
            <div className="text-sm text-gray-600">
              {isSearching ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#B351FF] border-t-transparent rounded-full animate-spin"></div>
                  Searching...
                </span>
              ) : (
                <span>
                  {searchResults.length === 0 
                    ? "No calls found matching your search" 
                    : `Found ${searchResults.length} call${searchResults.length !== 1 ? 's' : ''}`
                  }
                </span>
              )}
            </div>
          )}

          {/* Available Calls Display */}
          {callsToDisplay.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                {searchTerm ? (
                  <>
                    <Search className="w-4 h-4" />
                    Search Results:
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    Latest Calls:
                  </>
                )}
              </h4>
              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-xl p-3 bg-gray-50 space-y-2">
                {callsToDisplay
                  .filter(call => !callIds.includes(call.id)) // Only show calls not yet added
                  .map((call) => (
                    <div
                      key={call.id}
                      className="bg-white rounded-lg border border-gray-100 p-3 hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-800 text-sm truncate mb-1">
                            {call.name}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {call.client}
                            </span>
                            <span className="flex items-center gap-1">
                              <Building className="w-3 h-3" />
                              {call.clientCompany}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-400">
                              {new Date(call.callDate).toLocaleDateString()}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-600">{call.category}</span>
                            <span className="text-gray-400">•</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              call.rating === 'Positive' ? 'bg-green-100 text-green-800' :
                              call.rating === 'Mid' ? 'bg-blue-100 text-blue-800' :
                              call.rating === 'Mid2' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {call.rating}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => onAddCallId(call.id)}
                          className="ml-3 bg-[#B351FF]/10 hover:bg-[#B351FF]/20 text-[#B351FF] text-xs px-3 py-2 rounded-lg transition-all duration-200 font-medium group-hover:bg-[#B351FF] group-hover:text-white"
                        >
                          <Plus className="w-3 h-3 inline mr-1" />
                          Add
                        </button>
                      </div>
                    </div>
                  ))}
                {callsToDisplay.filter(call => !callIds.includes(call.id)).length === 0 && (
                  <p className="text-center text-gray-500 text-sm py-4">
                    {searchTerm ? "All search results have been added." : "All available calls have been added."}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Selected Call IDs List */}
          {callIds && callIds.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Selected Calls:</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {callIds.map((callId) => {
                  // Find the call details from either search results or available calls
                  const selectedCall = [...availableCalls, ...searchResults].find(call => call.id === callId);
                  const displayName = selectedCall ? selectedCall.name : `Call ${callId}`;

                  return (
                    <div
                      key={callId}
                      className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-xl border border-purple-200/50 group"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-gray-900 flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#B351FF] rounded-full flex-shrink-0"></div>
                          <span className="truncate">{displayName}</span>
                        </span>
                        {selectedCall && (
                          <div className="text-xs text-gray-500 mt-1 ml-4">
                            {selectedCall.client} • {selectedCall.clientCompany}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => onRemoveCallId(callId)}
                        className="ml-2 text-gray-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-all duration-200 flex-shrink-0"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
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
            ? "Enter question & select call IDs to analyze" 
            : "Analyze Calls with AI"
          }
        </button>
      </div>
    </div>
  );
};

export default SlidingChatPanel;