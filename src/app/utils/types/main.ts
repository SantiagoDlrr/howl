export interface TranscriptEntry {
    speaker: string;
    text: string;
  }
  
export interface Report {
  feedback: string;
  keyTopics: string[];
  emotions: string[];
  sentiment: string;
  output: string;
  riskWords: string[];
  summary: string;
  rating: number;
}

export interface FileData {
  id: number;
  name: string;
  date: string;
  type: string;
  duration: string;
  
  report: Report;
  transcript?: TranscriptEntry[]; 
  messages?: {
    role: "user" | "assistant";
    text: string;
  }[];
}