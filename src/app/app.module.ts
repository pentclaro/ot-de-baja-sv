import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { PagesModule } from './pages/pages.module';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { ErrorInterceptor } from './helpers/error.interceptor';

import { AppComponent } from './app.component';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from 'ngx-progressbar/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    PagesModule,
    HttpClientModule, // Permite hacer las peticiones http al backend
    NgProgressModule.withConfig({
      trickleSpeed: 200,
      min: 20,
      meteor: false,
      spinner: false,
      color: '#e91212'
    }),
    NgProgressHttpModule // NgProgressModule y NgProgressHttpModule nos permite mostrar una barra de progreso en función de las peticiones al backend
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }, // interceptor de seguridad
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true } // interceptor de errores
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
