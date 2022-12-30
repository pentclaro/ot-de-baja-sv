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
    const { pais, region, rango } = input
    return this.http.get(`${environment.apiURL}/fallasFibraOptica/getTablaResumen/${pais}/${region}/${rango}`)
  }

  getDataTablaPromedios(input? : any) {
    const { pais, region, rango } = input
    return this.http.get(`${environment.apiURL}/fallasFibraOptica/getTablaPromedios/${pais}/${region}/${rango}`)
  }

  getDataDetalle(input : any) {
    const { pais, region, rango, fecha, desde, hasta, tipo } = input
    return this.http.get(`${environment.apiURL}/fallasFibraOptica/getTablaDetalle/${pais}/${region}/${rango}/${fecha}/${desde}/${hasta}/${tipo}`)
  }
}
