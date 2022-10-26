import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeaderService } from '../header.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FaultService {

  constructor(
    private http: HttpClient,
    private queryService: HeaderService
  ) { }

  getAreas() {
    return this.http.get(`${environment.apiURL}/ticketsWO/getAreas`);
  }

  getCategorias(mes: any) {
    return this.http.get(`${environment.apiURL}/ticketsWO/getCategorias/${mes}`);
  }

  getCodigos(mes: any, area: any, categoria: any) {
    return this.http.get(`${environment.apiURL}/ticketsWO/getCodigos/${mes}/${area}/${categoria}`);
  }
}
