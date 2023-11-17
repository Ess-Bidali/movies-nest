import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, debounceTime, of, take } from 'rxjs';
import { MoviesService } from 'src/app/state/movies/movies.service';

@Component({
  selector: 'app-movies-page',
  templateUrl: './movies-page.component.html',
  styleUrls: ['./movies-page.component.scss']
})
export class MoviesPageComponent implements OnInit {
  searchControl = new FormControl<string>('');

  constructor(private moviesService: MoviesService,
    private _snackBar: MatSnackBar) {

  }

  ngOnInit() {
    this.moviesService.get();
    this.searchControl?.valueChanges.pipe(
      debounceTime(800)
    ).subscribe((searchTerm) => this.applyFilter(searchTerm));
  }

  applyFilter(searchTerm: string | null | undefined) {
    if(searchTerm && searchTerm?.trim()?.length) {
      this.moviesService.applyFilter(searchTerm)
        .pipe(
          take(1),
          catchError((err) => {
            this._snackBar.open('ERROR: ' + err.message, 'Close', {
              verticalPosition: 'top',
              duration: 2000
            });

            return of([]);
          })
        )
        .subscribe();
    } else {
      this.moviesService.resetStore();
    }
  }
}
