import { EntityState, EntityStore, StoreConfig, ActiveState } from '@datorama/akita';
import { Movie } from './movie.model';
import { Injectable } from '@angular/core';

export interface MoviesState extends EntityState<Movie, number>, ActiveState { }

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'movies', idKey: 'imdbID' })
export class MoviesStore extends EntityStore<MoviesState> {
  constructor() {
    super() ;
  }
}
