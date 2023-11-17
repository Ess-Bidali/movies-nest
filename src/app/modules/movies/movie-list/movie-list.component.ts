import { Component, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, of, take } from 'rxjs';
import { Movie } from 'src/app/state/movies/movie.model';
import { MoviesQuery } from 'src/app/state/movies/movies.query';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent {
  @Output() loadNext = new EventEmitter();


  constructor(
    public moviesQuery: MoviesQuery
  ) {
  }

  trackMovieRefrence(index: number, movie: Movie) {
    return movie.imdbID;
  }
}
