export interface CallLogEntry {
    id: number;
    callDate: string;
    client: string;
    clientFirstName?: string;
    clientLastName?: string;
    clientCompany: string;
    consultant_id: number;
    category: string;
    rating: string;
    time: string;
    context?: string;
    summary?: string;
    feedback?: string;
    tittle?: string;

    keyTopics?: string[]; 
    emotions?: string[];//
    sentiment?: string; 
    output?: string; 
    riskWords?: string[];
  }
  
  export type SortDirection = 'newest' | 'oldest';
  export type TimeSort = 'none' | 'longer' | 'shorter';
  
  export interface FilterOptions {
    companies: string[];
    categories: string[];
    ratings: string[];
  }