import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeaderService } from '../header.service';
import { environment } from 'src/environments/environment';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root',
})
export class MgOperandoEyService {
  constructor(private http: HttpClient, private queryService: HeaderService) {}
  getOtDeBajaSv(input?: any) {
    let { dateRange } = input;
    // console.log('tipo alarma', tipoAlarma, 'afectacion', afectacion);

    let { start, end } = dateRange;

    start = start.toLocaleDateString();
    end = end.toLocaleDateString();

    const startDateSepratedByDash = start.replace(/\//g, '-');
    const endDateSepratedByDash = end.replace(/\//g, '-');

    return this.http.get(
      `${environment.apiURL}/otDeBajaSv/getOtDeBajaSv/${startDateSepratedByDash}/${endDateSepratedByDash}`
    );
  }
  getMgOperando(input?: any) {
    let { pais, region, dateRange } = input;
    // console.log('tipo alarma', tipoAlarma, 'afectacion', afectacion);
    if (region.includes('TODAS') || pais === 'Regional') {
      region = 'TODAS';
    }
    let { start, end } = dateRange;

    start = start.toLocaleDateString();
    end = end.toLocaleDateString();

    const startDateSepratedByDash = start.replace(/\//g, '-');
    const endDateSepratedByDash = end.replace(/\//g, '-');

    return this.http.get(
      `${environment.apiURL}/mgOperandoEy/getMgOperando/${pais}/${region}/${startDateSepratedByDash}/${endDateSepratedByDash}`
    );
  }

  getCorteEnergia(input?: any) {
    let { pais, region, dateRange, afectacion } = input;
    // console.log('afectacion', afectacion);
    if (region.includes('TODAS') || pais === 'Regional') {
      region = 'TODAS';
    }
    let { start, end } = dateRange;

    start = start.toLocaleDateString();
    end = end.toLocaleDateString();

    const startDateSepratedByDash = start.replace(/\//g, '-');
    const endDateSepratedByDash = end.replace(/\//g, '-');

    return this.http.get(
      `${environment.apiURL}/mgOperandoEy/getCorteEnergia/${pais}/${region}/${startDateSepratedByDash}/${endDateSepratedByDash}/${afectacion}`
    );
  }
}
