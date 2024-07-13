import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  message: string | null = null;
  isRegisterDisabled = false;
  isError: boolean = false;

  constructor (
    private formBuilder: FormBuilder,
    private http: HttpClient,) { }

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

  onSubmit () {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    const formData = this.registerForm.value;
    this.http.post<{ message: string }>(`http://127.0.0.1:8000/accounts/register/`, formData).subscribe(
      response => {
        console.log('Registration successful', response);
         // Show success message and redirect to login
         this.message = response.message;
         this.isRegisterDisabled = true;
      },
      error => {
        console.error('Registration failed', error);
        if (error.error && error.error.errors) {
          const errors = error.error.errors;
          if (errors.username) {
            this.registerForm.controls['username'].setErrors({ serverError: errors.username[0] });
          }
          if (errors.email) {
            this.registerForm.controls['email'].setErrors({ serverError: errors.email[0] });
          }
          if (errors.password2) {
            this.registerForm.controls['password2'].setErrors({ serverError: errors.password2[0] });
          }
        }
      }
    );
  }
}
