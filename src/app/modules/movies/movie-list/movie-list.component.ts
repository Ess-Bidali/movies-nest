import { ViewportScroller } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Movie } from 'src/app/state/movies/movie.model';
import { MoviesQuery } from 'src/app/state/movies/movies.query';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent {
  @Output() loadNext = new EventEmitter();
  @Output() openSingle = new EventEmitter<string>();

  constructor(
    public moviesQuery: MoviesQuery,
    public viewportScroller: ViewportScroller
  ) {
  }

  trackMovieRefrence(index: number, movie: Movie) {
    return movie.imdbID;
  }
}
