import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-reset-password',
  templateUrl: './user-reset-password.component.html',
  styleUrls: ['./user-reset-password.component.scss']
})
export class UserResetPasswordComponent implements OnInit {
  private baseUrl: string = environment.baseUrl;

  resetPasswordForm: FormGroup;
  token: string | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  status: string | null = null;
  message: string | null = null;
  error: string | null = null;

/**
 * Initializes the component and sets up the form group with validators.
 * 
 * @param fb - FormBuilder instance to create form groups and form controls.
 * @param authService - AuthService instance to handle authentication-related tasks.
 * @param route - ActivatedRoute instance to access route parameters.
 * @param router - Router instance to navigate between routes.
 * @param http - HttpClient instance to make HTTP requests.
 */
  constructor (
    private fb: FormBuilder,
    private authService: AuthService, private route: ActivatedRoute, private router: Router, private http: HttpClient
  ) {
    this.resetPasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(2)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(2)]]
    }, { validator: this.passwordsMatchValidator });
  }


  /**
 * Custom validator to check if the new password and confirm password fields match.
 * 
 * @param form - FormGroup instance containing the form controls.
 * @returns null
 */
  passwordsMatchValidator (form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordsMismatch: true });
    } else {
      form.get('confirmPassword')?.setErrors(null);
    }
    return null;
  }


  /**
 * Lifecycle hook that is called after data-bound properties of a directive are initialized.
 * Retrieves the token from local storage.
 */
  ngOnInit () {
    this.token = localStorage.getItem('token') || '';

  }


/**
 * Handles the form submission for resetting the password.
 * Checks if the form is valid and if the new password and confirm password fields match.
 * Makes an HTTP POST request to reset the password.
 * Displays success or error messages based on the response.
 */
  onSubmit () {
    if (this.resetPasswordForm.valid) {
      const oldPassword = this.resetPasswordForm.get('oldPassword')?.value;
      const newPassword = this.resetPasswordForm.get('newPassword')?.value;
      const confirmPassword = this.resetPasswordForm.get('confirmPassword')?.value;

      if (newPassword !== confirmPassword) {
        this.errorMessage = 'Passwords do not match.';
        return;
      }

      this.http.post(`${this.baseUrl}/user/user_reset_password/`, {
        token: this.token,
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      }).subscribe({
        next: (response) => {
          this.successMessage = 'Password reset successful!';
          this.errorMessage = null;
          this.resetPasswordForm.reset();
        },
        error: (error: HttpErrorResponse) => {
          if (error.error?.non_field_errors) {
            this.errorMessage = error.error.non_field_errors.join(', ');
          } else {
            this.errorMessage = 'Failed to reset password. Please try again.';
          }
          this.successMessage = null;
        }
      });
    }
  }


  /**
 * Logs out the user by removing the token from local storage and navigating to the login page.
 * 
 * @param event - The event object.
 */
  logout (event: Event) {
    event.preventDefault();
    localStorage.removeItem('token');
    this.authService.setUsername(null);
    this.router.navigate(['/login']);
  }


  /**
 * Navigates to the home page.
 * 
 * @param event - The event object.
 */
  navigateToHome (event: Event) {
    event.preventDefault();
    this.router.navigate(['/home']);
  }

}