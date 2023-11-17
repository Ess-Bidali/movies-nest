import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

const components = [
  CommonModule,
  MatInputModule,
  MatToolbarModule,
  MatIconModule,
  MatSnackBarModule,
  MatProgressSpinnerModule
];


@NgModule({
  declarations: [],
  imports: components,
  exports: components
})
export class MaterialComponentsModule { }
