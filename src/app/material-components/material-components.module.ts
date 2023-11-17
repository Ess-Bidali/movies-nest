import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

const components = [
  CommonModule,
  MatInputModule,
  MatToolbarModule,
  MatIconModule
];


@NgModule({
  declarations: [],
  imports: components,
  exports: components
})
export class MaterialComponentsModule { }
