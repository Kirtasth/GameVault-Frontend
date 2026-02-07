import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormControl,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import {RouterLink, Router} from '@angular/router';
import {AuthService} from '../../core/services/auth.service';
import {finalize, switchMap} from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected registerForm!: FormGroup;
  protected submitted = false;
  protected loading = false;
  protected error = '';

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
      avatarUrl: new FormControl(''),
      bio: new FormControl('')
    }, {validators: this.passwordMatchValidator});

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['home']).then();
      return;
    }
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : {mismatch: true};
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    const {email, password} = this.registerForm.value;

    this.authService.register(this.registerForm.value)
      .pipe(
        switchMap(() => this.authService.login({email, password})),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: () => {
          this.router.navigate(['home']).then();
        },
        error: () => {
          this.error = 'Registration failed. Please try again.';
        }
      });
  }
}
