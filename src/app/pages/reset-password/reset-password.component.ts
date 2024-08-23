import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  private baseUrl: string = environment.baseUrl;
  
  resetPasswordForm: FormGroup;
  uidb64: string;
  token: string;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  status: string | null = null;
  message: string | null = null;
  error: string | null = null;
  resetEmail: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, private route: ActivatedRoute, private router: Router, private http: HttpClient
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    });

    // Extract parameters from the URL
    this.uidb64 = this.route.snapshot.paramMap.get('uidb64')!;
    this.token = this.route.snapshot.paramMap.get('token')!;
  }

  ngOnInit() {
    console.log("UIDB64: ", this.uidb64);
    console.log("Token: ", this.token);
    this.route.queryParams.subscribe(params => {
      this.resetEmail = params['email'] || '';
    });
  }

  resetPassword() {
    const url = `${this.baseUrl}/accounts/password_reset/`;
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

  navigateToRegister() {
    this.authService.setRegistering(true);
    this.authService.setLoggingIn(false);
    this.router.navigate(['/register']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
    this.authService.setRegistering(false);
    this.authService.setLoggingIn(true);
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      const newPassword = this.resetPasswordForm.get('newPassword')?.value;
      const confirmPassword = this.resetPasswordForm.get('confirmPassword')?.value;

      if (newPassword !== confirmPassword) {
        this.errorMessage = 'Passwords do not match.';
        return;
      }

      this.http.post(`${this.baseUrl}/accounts/set_new_password/`, {
        uidb64: this.uidb64,
        token: this.token,
        new_password: newPassword
      }).subscribe({
        next: (response) => {
          this.successMessage = 'Password reset successful!';
          this.errorMessage = null;
        },
        error: (error) => {
          this.errorMessage = 'Failed to reset password. Please try again.';
          this.successMessage = null;
        }
      });
    }
  }
}