export interface Source {
  value: string;
  short_url: string;
  title: string;
}

export interface ResearchRequest {
  query: string;
  max_research_loops?: number;
  initial_search_query_count?: number;
}

export interface ResearchResponse {
  answer: string;
  sources: Source[];
  iterations: number;
  status: string;
}

export interface ApiError {
  detail: string;
}