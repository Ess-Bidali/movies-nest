import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviesPageComponent } from './movies-page.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialComponentsModule } from '../../material-components/material-components.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('MoviesPageComponent', () => {
  let component: MoviesPageComponent;
  let fixture: ComponentFixture<MoviesPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MoviesPageComponent],
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MaterialComponentsModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    });
    fixture = TestBed.createComponent(MoviesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
