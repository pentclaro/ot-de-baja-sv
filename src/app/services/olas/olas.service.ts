import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HeaderService } from '../header.service';

@Injectable({
  providedIn: 'root'
})
export class OlasService {

  constructor(private http: HttpClient,
    private queryService: HeaderService) { }

  getAll(input: any) {
    // let queryParams = this.queryService.getQuery(input);${queryParams}
    return this.http.post(`${environment.apiURL}/sgidashboard/olas/olas`, input);
  }
  getSuppliers(input?: any) {
    // let queryParams = this.queryService.getQuery(input);${queryParams}
    return this.http.get(`${environment.apiURL}/sgidashboard/olas/suppliers`, input);
  }
  getYears(input?: any) {
    // let queryParams = this.queryService.getQuery(input);${queryParams}
    return this.http.get(`${environment.apiURL}/sgidashboard/olas/years`);
  }
}
