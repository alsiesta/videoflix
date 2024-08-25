declare var google: any;
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username: string | null = null;
  password: string | null = null;
  isLoading: boolean = false;
  status: string | null = null;
  message: string | null = null;
  activationLinkInvalid: boolean = false;
  error: string | null = null;
  showResetPasswordForm: boolean = false;
  resetEmail: string = '';
  showLoginForm: boolean = true;


  credentials = { username: '', password: '' };

  constructor (private authService: AuthService, private route: ActivatedRoute, private router: Router, private http: HttpClient) { }

  ngOnInit (): void {
    this.route.queryParams.subscribe(params => {
      this.username = params['username'] || null;
      this.status = params['status'] || null;
      this.message = params['message'] || null;

    });

    // this.djangoLogin()
    // this.googleSignIn()
  }

  resendActivationLink (email: string) {
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



  // login () {
  //   this.authService.login(this.credentials).subscribe(response => {
  //     localStorage.setItem('token', response.access);
  //     this.router.navigate(['/home']);
  //   }, error => {
  //     this.error = error.error?.error || error.error?.message || error.error?.detail || 'An error occurred';
  //   });
  // }

  async loginWithUsernameAndPassword () {
    this.isLoading = true;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "username": this.username,
      "password": this.password
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    try {
      let resp = await fetch("http://127.0.0.1:8000/login/", requestOptions)
      let json = await resp.json()
      localStorage.setItem('token', json.token);
      this.router.navigate(['/home']);

    } catch (error) {
      console.error('Error logging in', error);
    } finally {
      this.isLoading = false;
    }
  }


  toggleResetPasswordForm () {
    this.showResetPasswordForm = !this.showResetPasswordForm;
    this.showLoginForm = !this.showResetPasswordForm;
  }

  resetPassword () {
    const url = 'http://127.0.0.1:8000/accounts/password_reset/';
    const body = { email: this.resetEmail };
    this.error = null;
    this.message = null;
    this.status = null;

    this.http.post(url, body).subscribe(
      (response: any) => {
        if (response.message) {
          this.message = response.message;
          this.error = null;
          this.status = 'success';
          console.log('Password reset link sent successfully', response);
        } else if (response.error) {
          this.error = response.error;
          this.message = null;
          this.status = 'error';
          console.error('Error sending password reset link', response);
        }
      },
      (error: HttpErrorResponse) => {
        if (error.error?.email) {
          this.error = error.error.email.join(', ');
        } else {
          this.error = error.error?.error || error.error?.message || 'An error occurred';
        }
        this.message = null;
        this.status = 'error';
        console.error('Error sending password reset link', error);
      }
    );
  }

  navigateToRegister () {
    this.authService.setRegistering(true);
    this.authService.setLoggingIn(false);
    this.router.navigate(['/register']);
  }


}
