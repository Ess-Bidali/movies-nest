import { Injectable } from '@angular/core';
import { MoviesStore } from './movies.store';
import { testData } from './test';
import { from, map, tap } from 'rxjs';
import { environment } from 'environment';
import { Movie, MovieEndpointResponse } from './movie.model';

@Injectable({ providedIn: 'root' })
export class MoviesService {
  baseUrl = 'http://www.omdbapi.com/';

  constructor(protected store: MoviesStore) {
  }

  get() {
    this.store.set(testData);
  }

  /**
   * Format the provided filters and fetch the new list of values
   * @param filter
   * @param page
   * @param type
   * @returns
   */
  applyFilter(filter: string, page: number = 1, type?: 'movies' | 'series') {
    const params = {
      s: filter,
      page
    };
    this.store.setLoading(true);

    return from(this._performFetch(params))
      .pipe(
        map((data) => {
          this.store.setLoading(false);
          if(data?.Search) {
            this.store.set(data?.Search)
          }

          if(data.Error) {
            this.handleError(data.Error, params);
          } else {
            this.store.setError(null);
          }
        })
      )
  }

  /**
   * Handle errors thrown by API
   * @param error The error object
   * @param errorInput Input that led to the error
   */
  handleError(error: string, errorInput: any) {
    console.log('Input causing error: ', errorInput);
    this.store.set([]);

    if(typeof error === 'string') {
      switch(error?.toLowerCase()) {
        case 'too many results.':
          this.store.setError({ message: error});
          break;
        case 'movie not found!':
          // Ignore errors
          console.warn(error);
          break;

        default:
          // Alert user
          throw new Error(error);
      }
    } else {
      console.log(error);

      // Throw generic error
      throw new Error('An error occurred!');
    }
  }

  /**
   * Reset the store to the initial value
   */
  resetStore() {
    this.store.reset();
  }

  /**
   * Make the actual API call, applying the required apiKey and any additional parameters
   * @param params Query parameters to be appended to the request
   * @returns
   */
  private async _performFetch(params: { [paramKey: string]: string | number | undefined | null }): Promise<MovieEndpointResponse> {
    const queryParams = new URLSearchParams({
      apiKey: environment.apiKey,
      ...params
    });

    return fetch(this.baseUrl + '?' + queryParams)
      .then((val) => val.json())
  }
}
