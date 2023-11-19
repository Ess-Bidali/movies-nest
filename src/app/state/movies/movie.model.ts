export interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
  plot: string;
}

export interface DetailedMovie extends Movie {
  Actors: string,
  Awards: string,
  BoxOffice: string,
  Country: string,
  DVD: string,
  Director: string,
  Genre: string,
  Language: string,
  Metascore: string,
  Plot: string,
  Poster: string,
  Production: string,
  Rated: string,
  Released: string,
  Response: string,
  Runtime: string,
  Website: string,
  Writer: string,
  imdbRating: string,
  imdbVotes: string,
}

export interface MovieEndpointResponse {
  Search?: Movie[];
  Error?: string;
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
