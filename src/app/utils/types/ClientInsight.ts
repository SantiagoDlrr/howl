// types/ClientInsight.ts
export interface ClientInsight {
    clientName: string;
    lastContact: Date;
    summary: string;
    keyEmotions: string[];
    commonTopics: string[];
    recommendation: string;
    reports: {
      id: string;
      name: string;
      date: Date;
      duration: number;
      report: {
        sentiment: string;
        rating: number;
        summary: string;
        feedback: string;
        keyTopics: string[];
        emotions: string[];
      };
      transcript?: {
        speaker: string;
        text: string;
      }[];
    }[];
  }
  