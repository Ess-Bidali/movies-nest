import { QueryEntity } from '@datorama/akita';
import { MoviesStore, MoviesState } from './movies.store';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MoviesQuery extends QueryEntity<MoviesState> {
  constructor(protected moviesStore: MoviesStore) {
    super(moviesStore);
  }
}
