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
  }
  
  export type SortDirection = 'newest' | 'oldest';
  export type TimeSort = 'none' | 'longer' | 'shorter';
  
  export interface FilterOptions {
    companies: string[];
    categories: string[];
    ratings: string[];
  }