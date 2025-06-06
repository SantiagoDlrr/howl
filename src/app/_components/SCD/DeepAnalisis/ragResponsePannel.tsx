// ragResponsePannel.tsx
'use client';

import { useState, useMemo } from 'react';
import { Copy, ChevronDown, ChevronUp, MessageSquare, Clock, CheckCircle, Sparkles, AlertCircle, Brain } from 'lucide-react';

interface Source {
  call_id: string;
  text?: string;
  formatted_text?: string;
  score: number;
  raw_segments?: Array<{
    speaker: string;
    text: string;
    start?: number;
    end?: number;
  }>;
  start_segment?: number;
  end_segment?: number;
}

interface ResponseData {
  answer: string;
  sources: Source[];
}

interface RagResponsePanelProps {
  responseData: ResponseData | null;
  isLoading: boolean;
  error: string | null;
}

const RagResponsePanel = ({ responseData, isLoading, error }: RagResponsePanelProps) => {
  const [expandedSources, setExpandedSources] = useState<Set<number>>(new Set([0]));
  const [copiedStates, setCopiedStates] = useState<Set<string>>(new Set());

  const formatMarkdownText = (text: string) => {
    if (!text) return null;

    return text.split('\n').map((line, lineIndex) => {
      if (!line.trim()) return <br key={lineIndex} />;

      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, partIndex) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const boldText = part.slice(2, -2);
          return (
            <strong key={`${lineIndex}-${partIndex}`} className="font-semibold text-gray-900">
              {boldText}
            </strong>
          );
        }
        return part;
      });

      return (
        <div key={lineIndex} className="mb-1">
          {formattedLine}
        </div>
      );
    });
  };

  const toggleSource = (index: number) => {
    const newExpanded = new Set(expandedSources);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSources(newExpanded);
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(new Set([...copiedStates, id]));
      setTimeout(() => {
        setCopiedStates(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getSourceText = (source: Source): string => {
    if (source.formatted_text) return source.formatted_text;
    if (source.text) return source.text;
    if (source.raw_segments?.length) {
      return source.raw_segments
        .map(segment => `**${segment.speaker}:** ${segment.text}`)
        .join('\n');
    }
    return 'No text available';
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 0.8) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (score >= 0.6) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (score >= 0.4) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-red-50 text-red-700 border-red-200';
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl mb-6">
        <Brain className="w-10 h-10 text-[#B351FF]" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">Ready for Analysis</h3>
      <p className="text-gray-500 max-w-sm leading-relaxed">
        Submit a question and select any calls to get cited answers from your call recordings.
      </p>
      <div className="mt-6 flex items-center gap-2 text-sm text-[#B351FF]">
        <Sparkles className="w-4 h-4" />
        <span>AI Powered by Retrival Augmented Generation</span>
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="relative mb-6">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-[#B351FF] rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-[#B351FF] rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Analyzing Transcripts</h3>
        <p className="text-gray-500 mb-4">Our AI is processing your call data...</p>
        <div className="flex items-center justify-center gap-2 text-sm text-[#B351FF]">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>This may take a few moments</span>
        </div>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="p-6">
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Analysis Failed</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <p className="text-red-600 text-sm">Please check your call IDs and try again.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderResponse = () => {
    if (!responseData) return null;

    return (
      <div className="p-6 space-y-6">
        {/* Answer Section */}
        <div className="bg-gradient-to-br from-[#B351FF]/5 to-purple-100/30 border-2 border-[#B351FF]/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-[#B351FF] flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              RAG Result
            </h3>
            <button
              onClick={() => copyToClipboard(responseData.answer, 'answer')}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-[#B351FF] hover:text-[#9d44e8] hover:bg-purple-50 rounded-lg transition-all duration-200"
            >
              {copiedStates.has('answer') ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span>{copiedStates.has('answer') ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <div className="text-gray-800 leading-relaxed">
            {formatMarkdownText(responseData.answer)}
          </div>
        </div>

        {/* Sources Section */}
        {responseData.sources && responseData.sources.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#B351FF]" />
              Source Evidence ({responseData.sources.length})
            </h3>
            
            <div className="space-y-4">
              {responseData.sources.map((source, index) => {
                const sourceText = getSourceText(source);
                const isExpanded = expandedSources.has(index);
                
                return (
                  <div key={index} className="border-2 border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-200">
                    {/* Source Header */}
                    <div 
                      className="p-4 bg-gradient-to-r from-gray-50 to-purple-50/30 border-b border-gray-200 cursor-pointer hover:from-purple-50/50 hover:to-purple-100/50 transition-all duration-200"
                      onClick={() => toggleSource(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#B351FF] to-[#9d44e8] text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-lg">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 text-lg">Call {source.call_id}</h4>
                              {source.start_segment !== undefined && source.end_segment !== undefined && (
                                <p className="text-sm text-gray-500">
                                  Segments {source.start_segment + 1}-{source.end_segment + 1}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getRelevanceColor(source.score)}`}>
                            {(source.score * 100).toFixed(1)}% relevance
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Source Content */}
                    {isExpanded && (
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-semibold text-gray-700">Transcript Excerpt</span>
                          <button
                            onClick={() => copyToClipboard(sourceText, `source-${index}`)}
                            className="flex items-center space-x-2 px-3 py-1.5 text-xs text-gray-600 hover:text-[#B351FF] hover:bg-purple-50 rounded-lg transition-all duration-200"
                          >
                            {copiedStates.has(`source-${index}`) ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedStates.has(`source-${index}`) ? 'Copied!' : 'Copy'}</span>
                          </button>
                        </div>
                        
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed border-l-4 border-[#B351FF]">
                          {formatMarkdownText(sourceText)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-5 bg-gradient-to-r from-[#B351FF] to-[#9d44e8] text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-semibold">Cited Results</h2>
              <p className="text-purple-100 text-sm">RAG-powered AI Analysis</p>
            </div>
          </div>
          {responseData && (
            <div className="flex items-center space-x-2 text-sm text-purple-100">
              <Clock className="w-4 h-4" />
              <span>Just now</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? renderLoading() : 
         error ? renderError() : 
         responseData ? renderResponse() : 
         renderEmptyState()}
      </div>
    </div>
  );
};

export default RagResponsePanel;