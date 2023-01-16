import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeaderService } from '../header.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MgOperandoEyService {

  constructor(
    private http: HttpClient,
    private queryService: HeaderService
  ) { }
  getTableDetalle(input? : any) {
    const { pais, region } = input
    return this.http.get(`${environment.apiURL}/mgOperandoEy/getTableDetalle/${pais}/${region}`)
  }
}
