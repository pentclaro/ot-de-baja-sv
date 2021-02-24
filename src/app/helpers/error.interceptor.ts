import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('interceptor');
    const excludedUrl = [`${environment.apiHost}/login`]; // rutas que se excluyen de los errores
    if (excludedUrl.some(url => url === request.url)) { // si alguna coincide la deja pasar
      console.log('Excluded request: ' + request.url);
      return next.handle(request);
    } else {
      return next.handle(request).pipe(catchError(err => { // si no es el caso, se devuelve un error a no ser que tengan un estatus 601 o 401
        console.log(err);
        if (err.status === 601 || err.status === 401) {
          this.authenticationService.logout();
          location.reload();
        }
        const error = err.error.message || err.statusText;
        return throwError(error);
      }));
    }
  }
}
