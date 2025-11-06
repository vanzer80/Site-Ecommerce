
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CommonModule]
})
export class AdminLoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  // FIX: Explicitly cast injected Router to its type to resolve a potential type inference issue where it is treated as 'unknown'.
  private router = inject(Router) as Router;
  
  error = signal<string | null>(null);

  loginForm = this.fb.group({
    email: ['admin@example.com', [Validators.required, Validators.email]],
    password: ['password', Validators.required],
  });

  login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const success = this.authService.login(email!, password!);
      if (success) {
        this.router.navigate(['/admin']);
      } else {
        this.error.set('Email ou senha inválidos.');
      }
    }
  }
}
