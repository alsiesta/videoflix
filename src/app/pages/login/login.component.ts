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



  login() {
    this.authService.login(this.credentials).subscribe(response => {
      localStorage.setItem('token', response.access);
      this.router.navigate(['/home']);
    }, error => {
      this.error = error.error?.error || error.error?.message || error.error?.detail || 'An error occurred';
    });
  }

  toggleResetPasswordForm() {
    this.showResetPasswordForm = !this.showResetPasswordForm;
    this.showLoginForm = !this.showResetPasswordForm; 
  }

  resetPassword() {
    const url = 'http://127.0.0.1:8000/reset_password/';
    const body = { email: this.resetEmail };
    this.error = null;
    this.message = null;

    this.http.post(url, body).subscribe(
      response => {
        this.message = 'Password reset link sent successfully';
        this.error = null;
        console.log('Password reset link sent successfully', response);
      },
      (error: HttpErrorResponse) => {
        this.error = error.error?.error || error.error?.message || 'An error occurred';
        this.message = null;
        console.error('Error sending password reset link', error);
      }
    );
  }



}
