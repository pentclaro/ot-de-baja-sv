import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeaderService } from '../header.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MgOperandoEyService {
  constructor(private http: HttpClient, private queryService: HeaderService) {}
  getTableDetalle(input?: any) {
    let { pais, region } = input;
    console.log('regiones mgoperando', region);
    if (region.includes('TODAS')) {
      region = 'TODAS';
    }
    console.log(
      'cosultando datos de regiones',
      `${environment.apiURL}/mgOperandoEy/getTableDetalle/${pais}/${region}`
    );
    return this.http.get(
      `${environment.apiURL}/mgOperandoEy/getTableDetalle/${pais}/${region}`
    );
  }
}
