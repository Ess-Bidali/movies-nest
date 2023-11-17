import { Component } from '@angular/core';
import { Movie } from 'src/app/state/movies/movie.model';
import { MoviesQuery } from 'src/app/state/movies/movies.query';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent {
  constructor(public moviesQuery: MoviesQuery) {
  }

  trackMovieRefrence(index: number, movie: Movie) {
    return movie.imdbID;
  }
}
