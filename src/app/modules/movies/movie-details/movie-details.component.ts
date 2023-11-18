import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { DetailedMovie, Movie } from 'src/app/state/movies/movie.model';
import { MoviesQuery } from 'src/app/state/movies/movies.query';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent {
  movie: DetailedMovie | undefined;

  subscriptions = new Subscription();

  constructor(public moviesQuery: MoviesQuery) {
    const activeSub = this.moviesQuery.selectActive((activeMovie) => {
      this.movie = activeMovie as DetailedMovie;
    }).subscribe();

    this.subscriptions.add(activeSub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
