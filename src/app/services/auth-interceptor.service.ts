import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  // constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(req);
  }




  // intercept (request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     request = request.clone({
  //       setHeaders: { Authorization: `Token ${token}` }
  //     });
  //   }

  //   return next.handle(request).pipe(catchError((err) => {
  //     if (err instanceof HttpErrorResponse) {
  //       if (err.status === 401) {
  //         this.router.navigateByUrl('/login');
  //       }
  //     }
  //     return throwError(() => err);
  //   }));
  // }
}
