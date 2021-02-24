import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;
    cookieValue: any;

    constructor(
        private http: HttpClient,
        public router: Router) {
        this.currentUserSubject = new BehaviorSubject<any>(localStorage.getItem('session'));
        if (localStorage.getItem('session')) {
            this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('session')));
        }
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue() {
        return this.currentUserSubject.value;
    }

    tomorrow() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(8);
        tomorrow.setMinutes(0);
        tomorrow.setMilliseconds(0);
        return tomorrow;
    }

    login(username: string, password: string, countryId: number) {
        console.log(username, password);
        return this.http.post<any>(`${environment.apiHost}/login`, { username, password, countryId }, { observe: 'response' })
            .pipe(map((data: any) => {
                data = data.body || data;
                debugger
                if (data.token) {
                    localStorage.setItem('session', JSON.stringify(data));
                    this.currentUserSubject.next(data);
                }
                return data;
            }, error => {
                console.log(error);
            }));
    }

    sendPasswordRequest(input) {
        return this.http.post(`${environment.apiHost}/password-reset/`, input);
    }

    updatePassword(input) {
        return this.http.put(`${environment.apiHost}/password-reset/`, input);
    }

    logout() {
        localStorage.removeItem('session');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }
}
