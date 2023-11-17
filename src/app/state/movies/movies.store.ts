import { EntityState, EntityStore, StoreConfig, ActiveState } from '@datorama/akita';
import { Movie } from './movie.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface MoviesState extends EntityState<Movie, number>, ActiveState { }

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'movies', idKey: 'imdbID' })
export class MoviesStore extends EntityStore<MoviesState> {
  totalRecordsCount$ = new BehaviorSubject(0);
  currentPageNumber$ = new BehaviorSubject(0);
  lastPageReached$ = new BehaviorSubject(true);

  constructor() {
    super() ;
  }

  setPages(totalItems: number, itemsPerPage: number, pageNumber: number) {
    this.currentPageNumber$.next(pageNumber);
    this.totalRecordsCount$.next(totalItems);

    const numOfPages = totalItems > 0 ? totalItems / itemsPerPage : 0;
    const isFinalPage = pageNumber < 1 || numOfPages <= pageNumber;
    this.lastPageReached$.next(isFinalPage);
  }
}
