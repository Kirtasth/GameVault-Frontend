import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormField, form, required, email, minLength, validate, submit } from '@angular/forms/signals';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormField, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register implements OnInit {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  registerModel = signal({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatarUrl: '',
    bio: ''
  });

  registerForm = form(this.registerModel, (s) => {
    required(s.username, { message: 'Username is required' });
    minLength(s.username, 3, { message: 'Username must be at least 3 characters' });
    
    required(s.email, { message: 'Email is required' });
    email(s.email, { message: 'Invalid email format' });
    
    required(s.password, { message: 'Password is required' });
    minLength(s.password, 6, { message: 'Password must be at least 6 characters' });
    
    required(s.confirmPassword, { message: 'Confirm password is required' });
    
    validate(s.confirmPassword, ({ valueOf }) => {
      if (valueOf(s.password) !== valueOf(s.confirmPassword)) {
        return { kind: 'mismatch', message: 'Passwords do not match' };
      }
      return undefined;
    });
  });

  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['home']).then();
    }
  }

  onSubmit() {
    this.error.set('');

    submit(this.registerForm, async () => {
      this.loading.set(true);
      const { email, password } = this.registerModel();

      try {
        await firstValueFrom(this.authService.register(this.registerModel() as any));
        await firstValueFrom(this.authService.login({ email, password }));
        await this.router.navigate(['home']);
      } catch (err) {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 409) {
            this.error.set('This email is already registered.');
          } else if (err.status === 500) {
            this.error.set('A server error occurred. Please try again later.');
          } else {
            this.error.set('Registration failed. Please try again.');
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
