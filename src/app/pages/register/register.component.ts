import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

const BASE_URL = environment.baseUrl; 

interface RegisterResponse {
  user_id: number;
  username: string;
  email: string;
  is_active: boolean;
  first_name: string;
  last_name: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  message: string | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  isRegisterDisabled = false;
  isError: boolean = false;
  isLoading = false;

  constructor (
    private formBuilder: FormBuilder,
    private http: HttpClient, private router: Router,) { }

  ngOnInit (): void {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password1: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
      password2: ['', Validators.required]
    }, {
      validator: this.mustMatch('password1', 'password2')
    });
  }

  // Custom validator for password strength
  passwordStrengthValidator (control: FormControl) {
    const value = control.value;
    if (!value) return null;
    const hasUpperCase = /[A-Z]+/.test(value);
    const hasLowerCase = /[a-z]+/.test(value);
    const hasNumeric = /[0-9]+/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]+/.test(value);
    const valid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial;
    return valid ? null : { passwordStrength: true };
  }

  // Custom validator to check if passwords match
  mustMatch (password1: string, password2: string) {
    return (formGroup: FormGroup) => {
      const passControl = formGroup.controls[password1];
      const confirmPassControl = formGroup.controls[password2];
      if (confirmPassControl.errors && !confirmPassControl.errors['mismatch']) {
        return;
      }
      if (passControl.value !== confirmPassControl.value) {
        confirmPassControl.setErrors({ mismatch: true });
      } else {
        confirmPassControl.setErrors(null);
      }
    };
  }

  // Getter for easy access to form fields
  get f () {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
  
    this.isLoading = true;
    const formData = this.registerForm.value;
    const baseUrl = window.location.origin;
  
    this.http.post<RegisterResponse>(`${BASE_URL}/user/register/`, 
      { ...formData, password: formData.password1, baseUrl },
    ).subscribe(
      (data) => {
        console.log('Registration successful', data);
        this.successMessage = 'User was created.';
        this.isLoading = false; // Ensure isLoading is set to false on success
      },
      (error) => {
        console.error('Error occurred:', error);
        if (error.status === 400 && error.error && error.error.username) {
          this.errorMessage = error.error.username[0]; // Set errorMessage to the username error
          this.registerForm.controls['username'].setErrors({ serverError: error.error.username[0] });
        } else if (error.status === 400 && error.error && error.error.email) {
          this.errorMessage = error.error.email[0]; // Set errorMessage to the email error
          this.registerForm.controls['email'].setErrors({ serverError: error.error.email[0] });
        } else {
          this.errorMessage = 'An error occurred during registration';
        }
        this.isLoading = false; // Ensure isLoading is set to false on error
      }
    );
  }

  navigateToHome (event: Event) {
    event.preventDefault();
    this.router.navigate(['/home']);
  }

  clearAlert (): void {
    this.errorMessage = null;
    this.successMessage = null;
  }
}