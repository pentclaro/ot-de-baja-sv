import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../components/snack-bar/snack-bar.component';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  header = new EventEmitter<any>();
  country = new EventEmitter<any>();
  flowConfigObject: any;

  constructor(
    private snackBar: MatSnackBar,) { }

  getQuery(input: any): string {
    let query: string = '', index: number = 0;
    for (const key in input) {
      if (input[key] !== "") {
        const element = input[key];
        if (index == 0) {
          query += "?";
        } else {
          query += "&";
        }
        index++;
        query += key + "=" + element;
      }
    }
    return query;
  }

  openSnackBar(
    type: 'success' | 'warning' | 'error',
    message: string,
    horizontalPosition?: 'start' | 'center' | 'end' | 'left' | 'right',
    verticalPosition?: 'top' | 'bottom') {
    horizontalPosition = horizontalPosition || 'center';
    verticalPosition = verticalPosition || 'top';
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: { type, message },
      duration: 6000,
      horizontalPosition,
      verticalPosition
    });
  }
}
