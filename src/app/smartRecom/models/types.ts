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

 export interface Call {
  id: number;
  name: string;
  date: Date;
  duration: number;
  satisfaction: number;
  summary: string;
  client_id: number;
  type: string;
  sentiment_analysis: string;
}

export interface FeedbackMetrics {
  current: {
    total_calls: number;
    avg_satisfaction: number;
    avg_duration: number;
    total_duration: number;
    calls_by_type: Record<string, number>;
    ratings: number[]; // ✅ agregar esta línea

  };
  previous: {
    total_calls: number;
    avg_satisfaction: number;
    avg_duration: number;
    total_duration: number;
    calls_by_type: Record<string, number>;
  };
  deltas: {
    total_calls: number;
    avg_satisfaction: number;
    avg_duration: number;
    total_duration: number;
  };

  sentiments: Record<"positive" | "neutral" | "negative", number>;

  topClients: ClientMetrics[]
}

export interface ClientMetrics {
  client_id: number;
  total_calls: number;
  avg_duration: number;
  avg_satisfaction: number;
  first_name: string;
  last_name: string;
  email: string;
}


