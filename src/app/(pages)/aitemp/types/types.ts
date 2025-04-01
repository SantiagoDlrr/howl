// types/types.ts

export interface Aspect {
    text: string;
    sentiment: string;
    scores?: { [key: string]: number };
  }
  
  export interface TranscriptData {
    id: number;
    transcript: string;
    summary: string;
    emotion: string;
    aspects?: Aspect[];
  }
  
  export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
  }
  
  export interface Call {
    id: number;
    title: string;
    date: string;
    duration: string;
    category: string;
    rating: number;
    path: string;
    selected?: boolean;
  }