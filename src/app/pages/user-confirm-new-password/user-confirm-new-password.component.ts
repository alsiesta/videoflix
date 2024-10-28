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


  /**
 * Initializes the component and sets up the form group with validators.
 * Extracts the UID and token parameters from the URL.
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
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    });

    // Extract parameters from the URL
    this.uidb64 = this.route.snapshot.paramMap.get('uidb64')!;
    this.token = this.route.snapshot.paramMap.get('token')!;
  }


  /**
 * Lifecycle hook that is called after data-bound properties of a directive are initialized.
 */
  ngOnInit () { }


  /**
 * Handles the form submission for confirming the new password.
 * Checks if the form is valid and if the new password and confirm password fields match.
 * Makes an HTTP POST request to confirm the new password.
 * Displays success or error messages based on the response.
 */
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


  /**
 * Navigates to the home page.
 * 
 * @param event - The event object.
 */
  navigateToHome (event: Event) {
    event.preventDefault();
    this.router.navigate(['/home']);
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
 * Clears the error and success messages.
 */
  clearAlert (): void {
    this.error = null;
    this.successMessage = null;
  }
}
