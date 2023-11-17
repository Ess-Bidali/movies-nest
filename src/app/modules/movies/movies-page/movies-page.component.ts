import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, of, take } from 'rxjs';
import { MoviesQuery } from 'src/app/state/movies/movies.query';
import { MoviesService } from 'src/app/state/movies/movies.service';

@Component({
  selector: 'app-movies-page',
  templateUrl: './movies-page.component.html',
  styleUrls: ['./movies-page.component.scss']
})
export class MoviesPageComponent {
  searchControl = new FormControl<string>('');
  filtersForm: FormGroup;

  constructor(
    public moviesQuery: MoviesQuery,
    private moviesService: MoviesService,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) {
    this.filtersForm = formBuilder.group({
      title: '',
      type: '',
      year: ''
    });
  }

  applyFilter() {
    const { title, type, year } = this.filtersForm.value();
    const searchTerm = title || type || year;

    // At least one has to have a value
    if(searchTerm && searchTerm?.trim()?.length) {
      this.moviesService.applySearchTermFilter(searchTerm)
        .pipe(
          take(1),
          catchError((err) => {
            this.showErrorMessage(err);

            return of([]);
          })
        )
        .subscribe();
    } else {
      this.moviesService.resetStore();
    }
  }

  movePageBy(numOfPages: number) {
    this.moviesService.movePageBy(numOfPages).pipe(
      take(1),
      catchError((err) => {
        this.showErrorMessage(err);
        return of([]);
      })
    )
    .subscribe();
  }

  setYear(value: any, datepicker: MatDatepicker<any>) {
    // ctrlValue.year(normalizedMonthAndYear.year());
    // this.date.setValue(ctrlValue);
    console.log(value)
    datepicker.close();
  }

  showErrorMessage(err: Error) {
    this._snackBar.open('ERROR: ' + err.message, 'Close', {
      verticalPosition: 'top',
      duration: 3000
    });
  }
}
