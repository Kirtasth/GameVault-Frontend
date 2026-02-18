import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CatalogService} from '../../core/services/catalog.service';
import {finalize} from 'rxjs';
import {AuthService} from '../../core/services/auth.service';
import {NewDeveloperModel} from '../../core/models/catalog.model';

@Component({
  selector: 'app-developer-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './developer-registration.html',
  styleUrl: './developer-registration.css',
})
export class DeveloperRegistration implements OnInit {
  private readonly router: Router = inject(Router);
  private readonly catalogService: CatalogService = inject(CatalogService);
  private readonly authService: AuthService = inject(AuthService);

  protected devRegisterForm!: FormGroup;
  protected devRegisterModel!: NewDeveloperModel;
  protected userId: number | null = null;
  protected submitted: boolean = false;
  protected loading: boolean = false;
  protected error: string = '';

  ngOnInit(): void {
    this.devRegisterForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl('')
    })

    this.userId = this.authService.getUserId();
  }

  onSubmit() {
    this.submitted = true;

    if (this.devRegisterForm.invalid) {
      return;
    }

    if (this.userId == null) {
      this.authService.logout().subscribe(
        () => {
          this.router.navigate(['login']).then();
        }
      );
      return;
    }

    this.loading = true;

    this.devRegisterModel = {
      userId: this.userId,
      name: this.devRegisterForm.value.name,
      description: this.devRegisterForm.value.description
    }

    this.catalogService.registerDeveloper(this.devRegisterModel)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: () => {
          this.router.navigate(['home']).then();
        },
        error: () => {

          this.error = 'Registration failed. Please try again.';
          this.loading = false;
        }
      });
  }
}
