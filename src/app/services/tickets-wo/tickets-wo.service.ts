import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeaderService } from '../header.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TicketsWOService {

  constructor(
    private http: HttpClient,
    private queryService: HeaderService
  ) { }

  getDataTablaResumen(mes: any) {
    return this.http.get(`${environment.apiURL}/ticketsWO/getDataTablaResumen/${mes}`)
  }

  getDataTablaDetalle(pais: any, input: any) {
    const {mes, area, categoria, codigo} = input
    let newCodigo = []
    codigo.map(item => {
      if(item === 'MANIPULACION DE EQUIPOS Y/O CABLEADO'){
        item = 'MANIPULACION DE EQUIPOS Y-O CABLEADO'
        newCodigo.push(item)
      } else if (item === 'MANIPULACIÓN DE EQUIPOS Y/O CABLEADO'){
        item = 'MANIPULACIÓN DE EQUIPOS Y-O CABLEADO'
        newCodigo.push(item)
      } else {
        newCodigo.push(item)
      }
    })
    return this.http.get(`${environment.apiURL}/ticketsWO/getDataTablaDetalle/${mes}/${pais}/${area}/${categoria}/${newCodigo}`)
  }

  getDataResumen(mes: string) {
    return this.http.get(`${environment.apiURL}/ticketsWO/getResumen/${mes}`)
  }
}
