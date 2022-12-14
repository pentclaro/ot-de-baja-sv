import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeaderService } from '../header.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FallasFibraOpticaService {

  constructor(
    private http: HttpClient,
    private queryService: HeaderService
  ) { }

  getDataTablaResumen(input? : any) {
    return this.http.get(`${environment.apiURL}/fallasFibraOptica/getTablaResumen/${input.pais}/${input.region}`)
  }

  getDataTablaPromedios(input? : any) {
    return this.http.get(`${environment.apiURL}/fallasFibraOptica/getTablaPromedios`)
  }
}
