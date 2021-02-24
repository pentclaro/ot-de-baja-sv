import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../components/snack-bar/snack-bar.component';
// import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  header = new EventEmitter<any>();
  country = new EventEmitter<any>();
  flowConfigObject: any;

  constructor(
    private snackBar: MatSnackBar,) { }

  getQuery(input: any) {
    let query = "", index = 0;
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

  flowConfig() {
    // let token = JSON.parse(localStorage.session);
    // this.flowConfigObject = {
    //   target: `${environment.apiPublic}/files`,
    //   singleFile: true,
    //   testChunks: false,
    //   permanentErrors: [404, 500, 501],
    //   maxChunkRetries: 1,
    //   chunkRetryInterval: 5000,
    //   simultaneousUploads: 1,
    //   uploadMethod: 'POST',
    //   headers: {
    //     "Authorization": `Bearer ${token.token}`
    //   },
    // };
    return {};
  }
}
