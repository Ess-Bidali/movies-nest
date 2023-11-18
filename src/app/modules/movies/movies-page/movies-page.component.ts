import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, catchError, debounceTime, of, take } from 'rxjs';
import { MovieQueryParams } from 'src/app/state/movies/movie.model';
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
  firstQueryMade = false;
  subscriptions = new Subscription();

  constructor(
    public moviesQuery: MoviesQuery,
    public moviesService: MoviesService,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) {
    this.filtersForm = formBuilder.group({
      title: '',
      type: '',
      year: ''
    });

    const formSub = this.filtersForm.valueChanges
      .pipe(debounceTime(200))
      .subscribe((val) => {
        this.applyFilter(val);
      });

    this.subscriptions.add(formSub);
  }

  applyFilter(formValue = this.filtersForm.value, page = 1) {
    const { title, type, year } = formValue;

    // Search term/Title is mandatory
    if(title && title?.trim()?.length) {
      const params: MovieQueryParams = {
        s: title?.trim(),
        y: year,
        page,
        type
      }
      this.firstQueryMade = true;

      const movieQuerySub = this.moviesService.applyFilter(params)
        .pipe(
          take(1),
          catchError((err) => {
            this.showErrorMessage(err);

            return of([]);
          })
        )
        .subscribe();

      this.subscriptions.add(movieQuerySub);
    } else {
      this.moviesService.resetStore();
    }
  }

  movePageBy(numOfPages: number) {
    const pageChangeSub = this.moviesService.movePageBy(numOfPages).pipe(
      take(1),
      catchError((err) => {
        this.showErrorMessage(err);
        return of([]);
      })
    )
    .subscribe();

    this.subscriptions.add(pageChangeSub);
  }

  setYear(value: any, datepicker: MatDatepicker<any>) {
    // ctrlValue.year(normalizedMonthAndYear.year());
    // this.date.setValue(ctrlValue);
    console.log(value)
    datepicker.close();
  }

  showErrorMessage(err: Error) {
    this._snackBar.open(err.message, 'Close', {
      verticalPosition: 'top',
      duration: 3000
    });
  }

  viewSingleRecord(movieId: string, singleRecordPanel: MatSidenav) {
    this.moviesService.toggleActive(movieId, true);
    singleRecordPanel.open();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
