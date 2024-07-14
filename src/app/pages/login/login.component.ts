declare var google: any;
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username: string | null = null;
  status: string | null = null;
  message: string | null = null;
  activationLinkInvalid: boolean = false;
  error: string | null = null;

  constructor (private route: ActivatedRoute, private router: Router, private http: HttpClient) { }
  

  ngOnInit (): void {
    this.route.queryParams.subscribe(params => {
      this.username = params['username'] || null;
      this.status = params['status'] || null;
      this.message = params['message'] || null;

    });

    this.djangoLogin()
   // this.googleSignIn()
  }

  resendActivationLink(email: string) {
    const url = 'http://127.0.0.1:8000/resend_activation_link/';
    const body = { email: email };
    this.error = null;
    this.message = null;

    this.http.post(url, body).subscribe(
      response => {
        // Handle successful response
        // this.message = response. || null;
        this.error = null;
        console.log('Activation link resent successfully', response);
      },
      (error: HttpErrorResponse) => {
        // Handle error response
        this.error = error.error?.error || error.error?.message || 'An error occurred';
        this.message = null;
        console.error('Error resending activation link', error);
      }
    );
  }

  private decodeToken (token: string) {
    console.log('token', token);
    return JSON.parse(atob(token.split('.')[1]));
  }

  djangoLogin() {
    
  }


  // handleGoogleLogin (response: any) {
  //   if (response) {
  //     //decode the token
  //     const payLoad = this.decodeToken(response.credential);
  //     //store in session
  //     sessionStorage.setItem('loggedInUser', JSON.stringify(payLoad));
  //     //navigate to home
  //     this.router.navigate(['browse']);
  //   }
  //   console.log('response', response);
  // }


  // googleSignIn () {
  //   google.accounts.id.initialize({
  //     client_id: '711458419890-nqvcm6k1seh5hbm1anbc2t0om2cjblp6.apps.googleusercontent.com',
  //     callback: (resp: any) => this.handleGoogleLogin(resp)
  //   });

  //   google.accounts.id.renderButton(document.getElementById('google-btn'),
  //     {
  //       theme: 'filled_blue',
  //       size: 'large',
  //       shape: 'rectangle',
  //     });
  // }

}
