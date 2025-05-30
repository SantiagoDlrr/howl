// src/DeepAnalisis/models/types.ts

export interface FileData {
  id: number;
  name: string;
  date: string;
  type: string;
  duration: string;

  report: {
    feedback: string;
    keyTopics: string[];
    emotions: string[];
    sentiment: string;
    output: string;
    summary: string;
    rating: number;
  };

  transcript?: TranscriptSegment[];
  messages?: ChatMessage[];
}

export interface TranscriptSegment {
  speaker: string;
  text: string;
  start?: number;
  end?: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  timestamp?: string;
}

// RAG-specific types
export interface RagSource {
  call_id: string;
  text?: string; // Legacy format
  formatted_text?: string; // New formatted text with markdown
  score: number;
  raw_segments?: TranscriptSegment[];
  start_segment?: number;
  end_segment?: number;
}

export interface RagResponseData {
  answer: string;
  sources: RagSource[];
  processing_time?: number;
  total_chunks_searched?: number;
}

export interface RagRequest {
  question: string;
  call_ids: string[];
  model_name?: string;
  top_k?: number;
}

export interface RagRequestStatus {
  request_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
  error_message?: string;
  result?: RagResponseData;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Component prop types
export interface RagResponsePanelProps {
  responseData: RagResponseData | null;
  isLoading: boolean;
  error: string | null;
}

export interface RagChatPanelProps {
  question: string;
  callIds: string[];
  onQuestionChange: (question: string) => void;
  onAddCallId: (callId: string) => void;
  onRemoveCallId: (callId: string) => void;
  onSubmitQuestion: () => void;
  isLoading?: boolean;
}

// Utility types
export type RelevanceLevel = 'high' | 'medium' | 'low' | 'very-low';
export type SourceType = 'call' | 'transcript' | 'summary';

// Constants
export const RELEVANCE_THRESHOLDS = {
  high: 0.8,
  medium: 0.6,
  low: 0.4,
  'very-low': 0.0,
} as const;

export const RELEVANCE_COLORS = {
  high: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  medium: 'bg-blue-100 text-blue-800 border-blue-200',
  low: 'bg-amber-100 text-amber-800 border-amber-200',
  'very-low': 'bg-red-100 text-red-800 border-red-200',
} as const;

// Helper function to determine relevance level
export const getRelevanceLevel = (score: number): RelevanceLevel => {
  if (score >= RELEVANCE_THRESHOLDS.high) return 'high';
  if (score >= RELEVANCE_THRESHOLDS.medium) return 'medium';
  if (score >= RELEVANCE_THRESHOLDS.low) return 'low';
  return 'very-low';
};

// Legacy support
export type Response = Record<string, unknown>;