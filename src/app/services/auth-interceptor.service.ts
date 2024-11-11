import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    const csrfToken = localStorage.getItem('x-csrftoken');

    let headers = req.headers;
    if (token) {
      headers = headers.set('Authorization', `Token ${token}`);
    }
    if (csrfToken) {
      headers = headers.set('X-Csrftoken', csrfToken); // Ensure exact case
    }

    const clonedReq = req.clone({ headers });


    return next.handle(clonedReq);
  }
}
