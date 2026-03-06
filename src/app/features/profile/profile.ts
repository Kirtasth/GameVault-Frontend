import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Sidebar } from '../../core/components/sidebar/sidebar';
import { UserService } from '../../core/services/user.service';
import { UpdatedProfile } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, Sidebar, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);

  profileForm: FormGroup;
  isSaving = signal(false);
  isLoading = signal(true);
  selectedAvatar: File | null = null;
  avatarPreview: string | null = null;

  constructor() {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      bio: ['']
    });
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading.set(true);
    this.userService.fetchProfile().subscribe({
      next: (profile) => {
        this.profileForm.patchValue({
          username: profile.username,
          email: profile.email,
          bio: profile.bio,
          password: '' // Don't populate password
        });
        this.avatarPreview = profile.avatarUrl;
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.isLoading.set(false);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedAvatar = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isSaving.set(true);
      
      const updatedProfile: UpdatedProfile = {
        username: this.profileForm.value.username,
        email: this.profileForm.value.email,
        password: this.profileForm.value.password,
        bio: this.profileForm.value.bio,
        avatarImage: this.selectedAvatar as File
      };
      
      this.userService.updateProfile(updatedProfile).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.selectedAvatar = null;
          this.profileForm.get('password')?.reset();
        },
        error: (err) => {
          console.error('Error updating profile:', err);
          this.isSaving.set(false);
        }
      });
    }
  }
}
