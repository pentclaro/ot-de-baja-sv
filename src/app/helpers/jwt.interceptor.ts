import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const session = this.authenticationService.currentUserValue;
    const excludedUrl = [`${environment.apiHost}/login`, `${environment.apiPublic}/countries`];

    if (excludedUrl.some(url => url === request.url)) {
      console.log('Excluded request: ' + request.url);
      return next.handle(request);
    } else {
      // if (session.user && session.token) { // cuando se utilice correctamente las sesiones se valida el token y que este logeado un usuario
        request = request.clone({ // se interceptan las peticiones y se agrega el token de seguridad y todos los headers necesarios
          setHeaders: {
            'X-Access-Token': `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MTQyNzMyOTUwNzcsInVzZXIiOiJqb3NlLmhlcnJlcmEiLCJlbWFpbCI6Impvc2UuaGVycmVyYUBjbGFyby5jb20uZ3QiLCJyb2wiOjYyfQ.6v7tbihMaf1p7qdbn75Jn_RqWYrPjjnEfsxObWKdZbk`,
            'Content-Type': 'application/json'
          }
        });
      // }
    }

    return next.handle(request);
  }
}
