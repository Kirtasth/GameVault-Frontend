import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Sidebar } from '../../core/components/sidebar/sidebar';

@Component({
  selector: 'app-developer-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Sidebar],
  templateUrl: './developer-registration.html',
  styleUrl: './developer-registration.css',
})
export class DeveloperRegistration {
  private router = inject(Router);


  devForm = new FormGroup({
    devName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.minLength(20)])
  });

  submitted = false;
  loading = false;

  onSubmit() {
    this.submitted = true;

    if (this.devForm.invalid) {
      return;
    }

    this.loading = true;

    // Simulate API call
    setTimeout(() => {
      console.log('Developer Registration:', this.devForm.value);
      this.loading = false;
      this.router.navigate(['/home']);
      // TODO: Add actual API call to register as developer
    }, 1500);
  }
}
