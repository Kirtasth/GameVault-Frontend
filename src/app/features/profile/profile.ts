import { ChangeDetectionStrategy, Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormField, form, required, email, minLength, submit } from '@angular/forms/signals';
import { UserService } from '../../core/services/user.service';
import { UpdatedProfile } from '../../core/models/user.model';
import { firstValueFrom, Subject, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { DebounceClickDirective } from '../../core/directives/debounce-click.directive';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormField, DebounceClickDirective],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile implements OnInit, OnDestroy {
  private readonly userService = inject(UserService);

  private submitSubject = new Subject<void>();
  private sub?: Subscription;

  profileModel = signal({
    username: '',
    email: '',
    password: '',
    bio: ''
  });

  profileForm = form(this.profileModel, (s) => {
    required(s.username, { message: 'Username is required' });
    minLength(s.username, 3, { message: 'Username must be at least 3 characters' });
    
    required(s.email, { message: 'Email is required' });
    email(s.email, { message: 'Invalid email format' });
    
    minLength(s.password, 6, { message: 'Password must be at least 6 characters' });
  });

  isSaving = signal(false);
  isLoading = signal(true);
  selectedAvatar = signal<File | null>(null);
  avatarPreview = signal<string | null>(null);

  ngOnInit() {
    this.loadProfile();
    this.sub = this.submitSubject.pipe(
      throttleTime(500, undefined, { leading: true, trailing: false })
    ).subscribe(() => this.executeSubmit());
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  loadProfile() {
    this.isLoading.set(true);
    this.userService.fetchProfile().subscribe({
      next: (profile) => {
        this.profileModel.set({
          username: profile.username,
          email: profile.email,
          bio: profile.bio ?? '',
          password: ''
        });
        this.avatarPreview.set(profile.avatarUrl);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.isLoading.set(false);
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedAvatar.set(file);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.avatarPreview.set(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    this.submitSubject.next();
  }

  private executeSubmit() {
    submit(this.profileForm, async () => {
      this.isSaving.set(true);
      try {
        const updatedProfile: UpdatedProfile = {
          ...this.profileModel(),
          avatarImage: this.selectedAvatar() as File
        };

        await firstValueFrom(this.userService.updateProfile(updatedProfile));
        this.selectedAvatar.set(null);
        this.profileModel.update(m => ({ ...m, password: '' }));
      } catch (err) {
        console.error('Error updating profile:', err);
      } finally {
        this.isSaving.set(false);
      }
    });
  }
}
