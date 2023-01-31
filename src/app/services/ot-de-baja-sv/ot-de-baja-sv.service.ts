import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeaderService } from '../header.service';
import { environment } from 'src/environments/environment';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root',
})
export class OtDeBajaSvService {
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
}
