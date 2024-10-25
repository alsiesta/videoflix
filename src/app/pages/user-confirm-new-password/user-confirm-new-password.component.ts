import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-userconfirmnewpassword',
  templateUrl: './user-confirm-new-password.component.html',
  styleUrls: ['./user-confirm-new-password.component.scss']
})
export class UserconfirmnewpasswordComponent implements OnInit {
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

  constructor (
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

  ngOnInit () { }

  onSubmit () {
    if (this.resetPasswordForm.valid) {
      const newPassword = this.resetPasswordForm.get('newPassword')?.value;
      const confirmPassword = this.resetPasswordForm.get('confirmPassword')?.value;

      if (newPassword !== confirmPassword) {
        this.errorMessage = 'Passwords do not match.';
        return;
      }

      this.http.post(`${this.baseUrl}/user/password_reset_confirm/${this.uidb64}/${this.token}/`, {
        new_password: newPassword
      }).subscribe({
        next: (response) => {
          this.successMessage = 'Password reset successful!';
          this.errorMessage = null;
        },
        error: (error: HttpErrorResponse) => {
          if (error.error?.detail === 'Invalid token or user ID.') {
            this.errorMessage = 'Invalid token or user ID. Please try the password reset process again.';
          } else {
            this.errorMessage = 'Failed to reset password. Please try again.';
          }
          this.successMessage = null;
        }
      });
    }
  }

  navigateToHome (event: Event) {
    event.preventDefault();
    this.router.navigate(['/home']);
  }

  logout (event: Event) {
    event.preventDefault();
    localStorage.removeItem('token');
    this.authService.setUsername(null);
    this.router.navigate(['/login']);
  }

  clearAlert (): void {
    this.error = null;
    this.successMessage = null;
  }
}
