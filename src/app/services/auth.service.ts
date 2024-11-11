// declare var google: any;
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
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
  private usernameSubject = new BehaviorSubject<string | null>(localStorage.getItem('username'));
  private errorSubject = new BehaviorSubject<string | null>(null);


  isLoggingIn$ = this.loggingInSubject.asObservable();
  isRegistering$ = this.registeringSubject.asObservable();
  username$ = this.usernameSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  loginWithUsernameAndPassword (username: string, password: string) {
    const url = environment.baseUrl + "/login/";
    const body = {
      "username": username,
      "password": password
    };

    return lastValueFrom(this.http.post<LoginResponse>(url, body, { observe: 'response' }))
      .then((response: HttpResponse<LoginResponse>) => {
        // Log all headers to verify
        response.headers.keys().forEach(key => {
        });

        const csrfToken = response.headers.get('X-Csrftoken'); // Use exact case

        if (csrfToken) {
          localStorage.setItem('x-csrftoken', csrfToken);
        }
        const responseBody = response.body;
        if (!responseBody) {
          throw new Error('Response body is null');
        }
        const loginResponse: LoginResponse = {
          token: responseBody.token,
          user_id: responseBody.user_id,
          email: responseBody.email,
          username: responseBody.username,
          x_csrftoken: csrfToken ?? undefined // Ensure x_csrftoken is string or undefined
        };
        return loginResponse;
      })
      .catch((error: HttpErrorResponse) => {
        this.handleHttpError(error);
        throw error;
      });
  }

  handleHttpError (error: HttpErrorResponse): void {
    let errorMessage = 'An unexpected error occurred';

    if (error.error) {
      if (error.error.non_field_errors) {
        errorMessage = 'Non-field errors occurred: ' + error.error.non_field_errors;
      } else if (error.error.username) {
        errorMessage = 'Username error occurred: ' + error.error.username;
      } else if (error.error.password) {
        errorMessage = 'Password error occurred: ' + error.error.password;
      }
    }

    this.errorSubject.next(errorMessage);
    console.error('Error response body:', error.error);
    throw error;
  }

  setUsername (username: string | null) {
    if (username) {
      localStorage.setItem('username', username);
    } else {
      localStorage.removeItem('username');
    }
    this.usernameSubject.next(username);
  }

  isLoggedIn (): boolean {
    return !!localStorage.getItem('token');
  }

  logout (): void {
    localStorage.removeItem('token');
  }

  setLoggingIn (value: boolean) {
    this.loggingInSubject.next(value);
  }

  setRegistering (value: boolean) {
    this.registeringSubject.next(value);
  }



}
