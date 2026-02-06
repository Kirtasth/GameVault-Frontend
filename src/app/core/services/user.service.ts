import {inject, Injectable} from '@angular/core';
import {BackendService} from './api/backend.service';
import {map, Observable} from 'rxjs';
import {UserRole} from '../models/user.model';
import {AuthService} from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly backendService = inject(BackendService);
  private readonly authService = inject(AuthService);

  isUserDeveloper(): Observable<boolean> {
    const userId = this.authService.getUserId();

    if (!userId) {
      throw new Error('User ID not found');
    }

    return this.backendService.getUserProfile(userId).pipe(
      map(userProfile => userProfile.roles.some(role => role.role === UserRole.DEVELOPER))
    );
  }
}
