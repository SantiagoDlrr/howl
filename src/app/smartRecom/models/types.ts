// src/smartFeatures/models/types.ts

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
  
    transcript?: {
      speaker: string;
      text: string;
    }[];
  
    messages?: {
      role: "user" | "assistant";
      text: string;
    }[];
  }
  
  export interface ClientInsightResponse {
    clientName: string;
    lastContact: string;
    summary: string;
    keyEmotions: string[];
    commonTopics: string[];
    recommendation: string;
    reports: FileData[];
  }