import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeaderService } from '../header.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GestionDocumentalService {

  constructor(
    private http: HttpClient,
    private queryService: HeaderService
  ) { }

  obtenerGestionDocumentalResumen() {
    return this.http.get(`${environment.apiURL}/gestionDocumental/obtenerGestionDocumentalResumen`);
  }

  obtenerGestionDocumentalDetalle() {
    return this.http.get(`${environment.apiURL}/gestionDocumental/obtenerGestionDocumentalDetalle`);
  }
}
