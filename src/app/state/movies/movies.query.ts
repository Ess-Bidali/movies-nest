import { QueryEntity } from '@datorama/akita';
import { MoviesStore, MoviesState } from './movies.store';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MoviesQuery extends QueryEntity<MoviesState> {
  constructor(protected moviesStore: MoviesStore) {
    super(moviesStore);
  }

  lastPageReached() {
    return this.moviesStore.lastPageReached$.asObservable();
  }

  isFirstPage() {
    return !this.moviesStore.currentPageNumber$.asObservable()
      .pipe(map((pageNum) => pageNum === 1));
  }

  /**
   * Total number of items that match the applied filter
   */
  totalRecordsCount() {
    return this.moviesStore.totalRecordsCount$.asObservable();
  }
}
