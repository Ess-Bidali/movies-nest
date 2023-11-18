export interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface MovieEndpointResponse {
  Search: Movie[];
  Error: string;
  Response: 'True' | 'False';
  totalResults: string;
}

export interface MovieQueryParams {
  /** searchTerm */
  s: string;
  /** Page to be fetched */
  page: number;
  /** Record type to be fetched */
  type?: 'series' | 'movie';
  /** Year to restrict the results to */
  y?: string;
}
