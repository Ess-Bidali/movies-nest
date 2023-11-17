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

  applyFilter(filter: string) {
    const params = {
      s: filter,
    };

    return from(this.performFetch(params))
      .pipe(
        tap((val) => console.log('val')),
        tap((val) => {debugger}),
        map((data) => {
          if(data?.Search) {
            this.store.set(data?.Search)
          }

          if(data.Error) {
            throw new Error(data.Error);
          }
        })
      )
  }

  async performFetch(params: { [paramKey: string]: string }): Promise<MovieEndpointResponse> {
    const queryParams = new URLSearchParams({
      token: environment.apiKey,
      ...params
    });

    return fetch(this.baseUrl + '?' + queryParams)
      .then((val) => val.json())
  }
}
