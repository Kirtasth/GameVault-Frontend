import { inject, Injectable, signal } from '@angular/core';
import { BackendService } from './api/backend.service';
import { AuthService } from './auth.service';
import {UpdatedProfile, UserProfileModel} from '../models/user.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly backendService = inject(BackendService);
  private readonly authService = inject(AuthService);

  private userProfileSignal = signal<UserProfileModel | null>(null);
  readonly userProfile = this.userProfileSignal.asReadonly();

  fetchProfile(): Observable<UserProfileModel> {
    const userId = this.authService.getUserId();
    if (!userId) {
      throw new Error('User ID not found');
    }

    return this.backendService.getUserProfile(userId).pipe(
      tap(profile => this.userProfileSignal.set(profile))
    );
  }

  updateProfile(profile: UpdatedProfile): Observable<UserProfileModel> {
    const userId = this.authService.getUserId();
    if (!userId) {
      throw new Error('User ID not found');
    }

    return this.backendService.updateUserProfile(userId, profile).pipe(
      tap(newProfile => this.userProfileSignal.set(newProfile))
    );
  }

  clearProfile() {
    this.userProfileSignal.set(null);
  }
}
