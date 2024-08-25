// declare var google: any;
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, lastValueFrom } from 'rxjs';
import { LoginResponse } from '../models/models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://127.0.0.1:8000/api/token/';
  constructor (private http: HttpClient) { }
  private loggingInSubject = new BehaviorSubject<boolean>(true);
  private registeringSubject = new BehaviorSubject<boolean>(false);

  isLoggingIn$ = this.loggingInSubject.asObservable();
  isRegistering$ = this.registeringSubject.asObservable();
  

  loginWithUsernameAndPassword (username: string, password: string) {
    const url = environment.baseUrl + "/login/";
    const body = {
      "username": username,
      "password": password}
    return lastValueFrom(this.http.post<LoginResponse>(url, body))
  }

  // login(credentials: any): Observable<any> {
  //     console.log('Login credentials:', credentials);
  //     return this.http.post(this.loginUrl, credentials);
  // }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  setLoggingIn(value: boolean) {
    this.loggingInSubject.next(value);
  }

  setRegistering(value: boolean) {
    this.registeringSubject.next(value);
  }

  
  
}
