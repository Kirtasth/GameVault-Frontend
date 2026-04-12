import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormField, form, required, email, submit } from '@angular/forms/signals';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormField, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  loginModel = signal({
    email: '',
    password: ''
  });

  loginForm = form(this.loginModel, (s) => {
    required(s.email, { message: 'Email is required' });
    email(s.email, { message: 'Invalid email format' });
    required(s.password, { message: 'Password is required' });
  });

  loading = signal(false);
  error = signal('');

  onSubmit() {
    this.error.set('');

    submit(this.loginForm, async () => {
      this.loading.set(true);
      try {
        await firstValueFrom(this.authService.login(this.loginModel()));
        await this.router.navigate(['']);
      } catch (err) {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.error.set('Invalid email or password.');
          } else if (err.status === 500) {
            this.error.set('A server error occurred. Please try again later.');
          } else {
            this.error.set('An unexpected error occurred. Please try again.');
          }
        } else {
          this.error.set('An unexpected error occurred.');
        }
      } finally {
        this.loading.set(false);
      }
    });
  }
}
