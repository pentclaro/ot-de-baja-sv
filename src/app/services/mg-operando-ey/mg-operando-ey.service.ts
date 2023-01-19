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
    let { pais, region, dateRange } = input;
    console.log('regiones mgoperando', region);
    if (region.includes('TODAS')) {
      region = 'TODAS';
    }
    let { start, end } = dateRange;
    console.log(
      'startDate',
      start.getMonth(),
      'enddate',
      end.toLocaleDateString()
    );
    start = start.toLocaleDateString();
    end = end.toLocaleDateString();

    const startDateSepratedByDash = start.replace(/\//g, '-');
    const endDateSepratedByDash = end.replace(/\//g, '-');

    console.log(
      'startDate dash',
      startDateSepratedByDash,
      'enddate dash',
      endDateSepratedByDash
    );
    return this.http.get(
      `${environment.apiURL}/mgOperandoEy/getTableDetalle/${pais}/${region}/${startDateSepratedByDash}/${endDateSepratedByDash}`
    );
  }
}
