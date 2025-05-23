// src/smartFeatures/models/types.ts

export interface FileData {
    id: number;
    name: string;
    date: Date;
    type: string;
    duration: number;
    client_name: string;
  
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
    lastContact: Date;
    summary: string;
    keyEmotions: string[];
    commonTopics: string[];
    recommendation: string;
    reports: FileData[];
  }