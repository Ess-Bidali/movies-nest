import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialComponentsModule } from '../material-components/material-components.module';

import { MoviesPageComponent } from './movies-page/movies-page.component';
import { MoviesRoutingModule } from './movies-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';




@NgModule({
  declarations: [
    MoviesPageComponent,
    MovieListComponent,
    MovieDetailsComponent
  ],
  imports: [
    MoviesRoutingModule,
    CommonModule,
    MaterialComponentsModule,
    ReactiveFormsModule
  ]
})
export class MoviesModule { }
