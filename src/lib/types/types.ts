export type Query = {
    query: string;
    response: string;
    tokensUsed: number;
    _id: string;
    createdAt: string;
    updatedAt: string;
  };
  
  export type SubjectData = {
    subject: string;
    queries: Query[];
    _id: string;
  };
  
  export type HistoryDataItem = {
    _id: string;
    date: string;
    subjectWise: SubjectData[];
    totalTokensSpent: number;
    subjects: string[];
    userId: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  
  export type APIResponse = {
    data: HistoryDataItem[];
  };
  
  export type FormData = {
    dob: Date | null;
    name: string;
    phoneno: string;
    schoolName: string;
    class: string;
    subjects: string[];
  };
  