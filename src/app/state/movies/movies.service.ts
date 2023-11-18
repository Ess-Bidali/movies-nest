import { Injectable } from '@angular/core';
import { MoviesStore } from './movies.store';
import { from, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MovieEndpointResponse, MovieQueryParams } from './movie.model';

@Injectable({ providedIn: 'root' })
export class MoviesService {
  baseUrl = 'http://www.omdbapi.com/';
  latestParams: MovieQueryParams = {
    s: '',
    page: 1
  };

  constructor(protected store: MoviesStore) {
  }

  movePageBy(numOfPages: number) {
    const nextPage = this.latestParams.page + numOfPages;
    return this.applyFilter({
      ...this.latestParams,
      page: nextPage
    })
  }

  /**
   * Format the provided filters and fetch the new list of values
   *
   * @param params Object containing the parameter inputs to be applied
   * @returns
   */
  applyFilter(params: MovieQueryParams) {
    this.store.setLoading(true);

    return from(this._performFetch(params))
      .pipe(
        map((result) => {
          const data = result ?? {};
          // Only update params reference after a successful call
          this.latestParams = params;

          this.store.setLoading(false);

          this.handlePositiveResult(data, params.page);

          this.setPaginationData(data, params.page);

          // Check for errors
          if(data.Error) {
            this.handleError(data.Error, params);
          } else {
            this.store.setError(null);
          }
        })
      )
  }

  handlePositiveResult(data: MovieEndpointResponse, page: number) {
    if(data?.Search) {
      // Update records list
      if(page > 1) {
        this.store.add(data.Search);
      } else {
        this.store.set(data?.Search);
      }
    }
  }

  /**
   * Server side pagination is applied, this stores current "cursor"
   * in order to fetch next and previous pages
   *
   * @param data Response from API
   * @param page latest fetched page
   */
  setPaginationData(data: MovieEndpointResponse, page: number) {
    if(data.totalResults) {
      try {
        const totalRecords = parseInt(data.totalResults);
        this.store.setPages(totalRecords, 10, page);
      } catch(err) {
        console.log('Invalid totalResults value from API. Value: ', data.totalResults);
        this.store.setPages(0, 10, 1);
      }
    } else {
      this.store.setPages(0, 10, 1);
    }
  }

  /**
   * Handle errors thrown by API
   *
   * @param error The error object
   * @param errorInput Input that led to the error
   */
  handleError(error: string, errorInput: any) {
    console.log('Input causing error: ', errorInput);
    this.store.set([]);

    if(typeof error === 'string') {
      switch(error?.toLowerCase()) {
        case 'too many results.':
          this.store.setError({ message: error + ' Keep typing to refine'});
          break;
        case 'movie not found!':
        case 'series not found!':
          // Ignore errors
          console.warn(error);
          this.store.setError(null);
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
    this.store.set([]);
  }

  /**
   * Make the actual API call, applying the required apiKey and any additional parameters
   *
   * @param params Query parameters to be appended to the request
   * @returns
   */
  private async _performFetch(params: MovieQueryParams): Promise<MovieEndpointResponse> {
    const input = {
      apiKey: environment.apiKey,
      ...params
    };
    const queryParams = new URLSearchParams(input as any);

    return fetch(this.baseUrl + '?' + queryParams)
      .then((val) => val.json())
      .catch((err) => console.log('err', err));
  }
}
