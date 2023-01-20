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
    let { pais, region, tipoAlarma, afectacion, dateRange } = input;
    console.log('tipo alarma', tipoAlarma, 'afectacion', afectacion);
    if (region.includes('TODAS')) {
      region = 'TODAS';
    }
    let { start, end } = dateRange;

    start = start.toLocaleDateString();
    end = end.toLocaleDateString();

    const startDateSepratedByDash = start.replace(/\//g, '-');
    const endDateSepratedByDash = end.replace(/\//g, '-');

    return this.http.get(
      `${environment.apiURL}/mgOperandoEy/getTableDetalle/${pais}/${region}/${startDateSepratedByDash}/${endDateSepratedByDash}/${tipoAlarma}/${afectacion}`
    );
  }
}
