declare var google: any;
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { LoginResponse } from 'src/app/models/models';
import { environment } from 'src/environments/environment'; // Import environment


const BASE_URL = environment.baseUrl; // Use the BASE_URL from environment

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

  constructor (private authService: AuthService, private route: ActivatedRoute, private router: Router, private http: HttpClient) { }

  ngOnInit (): void {
    this.route.queryParams.subscribe(params => {
      this.username = params['username'] || null;
      this.status = params['status'] || null;
      this.message = params['message'] || null;

    });

    this.authService.error$.subscribe(error => {
      this.error = error;
    });
  }

  resendActivationLink (email: string) {
    const url = `${BASE_URL}/resend_activation_link/`;
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

  clearAlert (): void {
    this.error = null;
    this.message = null;
  }

  async login () {
    if (this.username === null || this.password === null) {
      console.error('Username or password is null');
      return;
    }

    this.isLoading = true;
    this.error = null;
    try {
      let resp: LoginResponse = await this.authService.loginWithUsernameAndPassword(this.username, this.password)

      localStorage.setItem('token', resp.token);
      localStorage.setItem('username', resp.username);
      this.authService.setUsername(resp.username);

      this.router.navigate(['/home']);
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.error = error.error?.non_field_errors || 'Invalid Credentials';
      } else {
        this.error = 'An error occurred during login';
      }
    } finally {
      this.isLoading = false;
    }
  }


  toggleResetPasswordForm () {
    this.showResetPasswordForm = !this.showResetPasswordForm;
    this.showLoginForm = !this.showResetPasswordForm;
  }

  resetPassword () {
    const url = `${BASE_URL}/user/mail_reset_password/`;
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
          this.clearAlert ()
        } else if (response.detail) {
          this.message = response.detail;
          this.error = null;
          this.status = 'success';
          console.log('Password reset link sent successfully', response);
        }
      },
      (error: HttpErrorResponse) => {
        if (error.error?.email) {
          this.error = error.error.email.join(', ');
        } else if (error.error?.detail) {
          this.error = error.error.detail;
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
