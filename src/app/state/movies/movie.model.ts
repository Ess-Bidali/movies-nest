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
  Response: boolean;
}
