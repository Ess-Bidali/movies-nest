import { Injectable } from '@angular/core';
import { MoviesStore } from './movies.store';
import { from, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DetailedMovie, MovieEndpointResponse, MovieQueryParams } from './movie.model';

@Injectable({ providedIn: 'root' })
export class MoviesService {
  baseUrl = 'https://www.omdbapi.com/';
  latestParams: MovieQueryParams = {
    s: '',
    page: 1
  };

  constructor(protected store: MoviesStore) {
  }

  toggleActive(movieId: string, setActive: boolean) {
    if(setActive) {
      this.store.setActive(movieId);
      this._querySingle(movieId);
    } else  {
      this.store.setActive(null);
    }
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
        map((result) => this.handleResult(result, params))
      );
  }

  /**
   * Handle API result
   *
   * @param result response
   * @param params
   */
  handleResult(result: MovieEndpointResponse, params: MovieQueryParams) {
    const data = result ?? {};

    this.latestParams = params;

    this.store.setLoading(false);

    this.updateStore(data, params.page);

    this.setPaginationData(data, params.page);

    // Check for errors
    if(data.Error) {
      this.handleError(data.Error, params);
    } else {
      this.store.setError(null);
    }
  }

  /**
   * Set store data when a response is received from the API
   *
   * @param data Response received from the API containing the new records to be displayed
   * @param page The latest fetched page used to determine whether to append the next page
   * to the store or replace current store records with the response data
   */
  updateStore(data: MovieEndpointResponse, page: number) {
    if(data?.Search) {
      // Update records list
      if(page > 1) {
        this.store.add(data.Search);
      } else {
        this.store.set(data?.Search);
      }
    } else {
      this.store.set([]);
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
          this.store.setError(error);
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

  private async _querySingle(movieId: string) {
    const input = {
      apiKey: environment.apiKey,
      i: movieId,
      plot: 'full'
    };

    const queryParams = new URLSearchParams(input as any);

    return fetch(this.baseUrl + '?' + queryParams)
      .then((val) => val.json())
      .then((val: DetailedMovie) => this.store.updateActive(val))
      .catch((err) => console.log('err', err));
  }
}
