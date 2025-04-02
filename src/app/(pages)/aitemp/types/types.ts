// types/types.ts

export interface Aspect {
    text: string;
    sentiment: string;
    scores?: { [key: string]: number };
  }
  
  export interface ReportData {
    feedback?: string;
    keyTopics?: string[];
    emotions?: string[];
    sentiment?: string;
    output?: string;
    summary?: string;
  }

  export interface TranscriptData {
    id: number | string;       // might be string if your backend uses UUIDs
    transcript_text: string;
    oci_emotion: string;
    oci_aspects?: Aspect[];
    report?: ReportData;       // <-- add this
  }
  
  export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
  }
  
  export interface Call {
    id: number | string;
    title: string;
    date: string;
    duration: string;
    category: string;
    rating: number;
    path: string;
    selected?: boolean;
  }