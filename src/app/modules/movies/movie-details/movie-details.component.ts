import { ViewportScroller } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { DetailedMovie, Movie } from 'src/app/state/movies/movie.model';
import { MoviesQuery } from 'src/app/state/movies/movies.query';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent {
  @Output() close = new EventEmitter();

  movie: DetailedMovie | undefined;

  subscriptions = new Subscription();

  constructor(
    public moviesQuery: MoviesQuery,
    public viewportScroller: ViewportScroller
  ) {
    const activeSub = this.moviesQuery.selectActive((activeMovie) => {
      this.movie = activeMovie as DetailedMovie;
    }).subscribe();

    this.subscriptions.add(activeSub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
