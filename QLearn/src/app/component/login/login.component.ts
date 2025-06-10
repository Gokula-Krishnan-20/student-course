import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  signUpForm: FormGroup;
  error = '';
  logo = 'assets/logo.png'; // update this path to match your actual logo

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required]],
      password: ['', [
        Validators.required
      ]],
      // Optional: Add role and skill controls if you uncomment them in HTML later
      // role: ['', Validators.required],
      // skill: ['']
    });
  }

  submit(): void {
    if (this.signUpForm.invalid) return;

    const { name, password } = this.signUpForm.value;

    this.authService.login(name, password).subscribe({
      next: (res) => {
        const payload = this.authService.storeToken(res.token);

        if (payload.role === 'admin' || payload.role === 'principal') {
          this.router.navigate(['/principal-dashboard']);
        } else if (payload.role === 'student') {
          this.router.navigate(['/courses']);
        } else {
          this.error = 'Unknown role';
        }
      },
      error: () => {
        this.error = 'Invalid credentials';
      }
    });
  }

  resetForm(): void {
    this.signUpForm.reset();
    this.error = '';
  }
}
