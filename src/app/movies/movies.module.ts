import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialComponentsModule } from '../material-components/material-components.module';

import { MoviesPageComponent } from './movies-page/movies-page.component';
import { MoviesRoutingModule } from './movies-routing.module';




@NgModule({
  declarations: [
    MoviesPageComponent
  ],
  imports: [
    MoviesRoutingModule,
    CommonModule,
    MaterialComponentsModule
  ]
})
export class MoviesModule { }
