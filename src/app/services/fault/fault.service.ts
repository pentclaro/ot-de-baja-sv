import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HeaderService } from '../header.service';

@Injectable({
  providedIn: 'root'
})
export class FaultService {

  constructor(private http: HttpClient,
    private queryService: HeaderService) { }

  getFaultOpen(input: any) {
    // let queryParams = this.queryService.getQuery(input);${queryParams}
    return this.http.post(`${environment.apiURL}/fault/open`, input);
  }
  getFaultClose(input: any) {
    return this.http.post(`${environment.apiURL}/fault/close`, input);
  }
  getCountry(input: any) {
    return this.http.get(`${environment.apiURL}/fault/coutries`, input);
  }
  getCategory(input: any) {
    return this.http.get(`${environment.apiURL}/fault/categories`, input);
  }
}
