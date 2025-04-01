export interface Report {
    feedback: string;
    keyTopics: string[];
    emotions: string[];
    sentiment: string;
    output: string;
  }
  
  export interface FileData {
    id: number;
    name: string;
    date: string;
    type: string;
    duration: string;
    rating: number;
    report: Report;
  }