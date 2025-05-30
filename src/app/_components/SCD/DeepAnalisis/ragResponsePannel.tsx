'use client';

import { useState, useMemo } from 'react';
import { Copy, ChevronDown, ChevronUp, MessageSquare, Clock, CheckCircle } from 'lucide-react';

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
  const [expandedSources, setExpandedSources] = useState<Set<number>>(new Set([0])); // First source expanded by default
  const [copiedStates, setCopiedStates] = useState<Set<string>>(new Set());

  // Parse markdown-like formatting
  const formatMarkdownText = (text: string) => {
    if (!text) return null;

    return text.split('\n').map((line, lineIndex) => {
      if (!line.trim()) return <br key={lineIndex} />;

      // Handle **bold text**
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
    if (score >= 0.8) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (score >= 0.6) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (score >= 0.4) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl mb-6">
        <MessageSquare className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready for your question</h3>
      <p className="text-gray-500 max-w-sm">
        Submit a question with call IDs to get AI-powered insights from your call transcripts.
      </p>
    </div>
  );

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-blue-600 rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="mt-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyzing transcripts...</h3>
        <p className="text-gray-500">This may take a few moments</p>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
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
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-blue-900 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Analysis Result
            </h3>
            <button
              onClick={() => copyToClipboard(responseData.answer, 'answer')}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm text-blue-700 hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-colors"
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
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Source Evidence ({responseData.sources.length})
            </h3>
            
            <div className="space-y-4">
              {responseData.sources.map((source, index) => {
                const sourceText = getSourceText(source);
                const isExpanded = expandedSources.has(index);
                
                return (
                  <div key={index} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                    {/* Source Header */}
                    <div 
                      className="p-4 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => toggleSource(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center text-sm font-semibold">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">Call {source.call_id}</h4>
                              {source.start_segment !== undefined && source.end_segment !== undefined && (
                                <p className="text-sm text-gray-500">
                                  Segments {source.start_segment + 1}-{source.end_segment + 1}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRelevanceColor(source.score)}`}>
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
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-700">Transcript Excerpt</span>
                          <button
                            onClick={() => copyToClipboard(sourceText, `source-${index}`)}
                            className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                          >
                            {copiedStates.has(`source-${index}`) ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedStates.has(`source-${index}`) ? 'Copied!' : 'Copy'}</span>
                          </button>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed border-l-4 border-purple-400">
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
    <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
            Analysis Results
          </h2>
          {responseData && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
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