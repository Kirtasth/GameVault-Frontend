import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormField, form, required, minLength, submit } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { CatalogService } from '../../core/services/catalog.service';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { NewDeveloperModel } from '../../core/models/catalog.model';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-developer-registration',
  imports: [CommonModule, FormField],
  templateUrl: './developer-registration.html',
  styleUrl: './developer-registration.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeveloperRegistration implements OnInit {
  private readonly router: Router = inject(Router);
  private readonly catalogService: CatalogService = inject(CatalogService);
  private readonly authService: AuthService = inject(AuthService);
  private readonly userService: UserService = inject(UserService);

  devRegisterModel = signal({
    name: '',
    description: ''
  });

  devRegisterForm = form(this.devRegisterModel, (s) => {
    required(s.name, { message: 'Developer name is required' });
    minLength(s.name, 3, { message: 'Name must be at least 3 characters' });
  });

  protected userId: number | null = null;
  protected loading = signal(false);
  protected error = signal('');

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
  }

  onSubmit() {
    submit(this.devRegisterForm, async () => {
      if (this.userId == null) {
        await firstValueFrom(this.authService.logout());
        await this.router.navigate(['login']);
        return;
      }

      this.loading.set(true);
      try {
        const payload: NewDeveloperModel = {
          userId: this.userId,
          name: this.devRegisterModel().name,
          description: this.devRegisterModel().description
        };

        await firstValueFrom(this.catalogService.registerDeveloper(payload));
        await firstValueFrom(this.userService.fetchProfile());
        await this.router.navigate(['home']);
      } catch (err) {
        this.error.set('Registration failed. Please try again.');
      } finally {
        this.loading.set(false);
      }
    });
  }

  onCancel() {
    this.router.navigate(['home']);
  }
}
