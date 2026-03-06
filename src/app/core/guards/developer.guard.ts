import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {UserService} from '../services/user.service';
import {AuthService} from '../services/auth.service';
import {map, Observable} from 'rxjs';
import {UserProfileModel, UserRole} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DeveloperGuard implements CanActivate {
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    const profile = this.userService.userProfile();
    if (profile) {
      return this.checkRole(profile);
    }

    return this.userService.fetchProfile().pipe(
      map(profile => this.checkRole(profile))
    );
  }

  private checkRole(profile: UserProfileModel): boolean {
    const isDeveloper = profile.roles.some(r => r.role === UserRole.DEVELOPER);
    if (!isDeveloper) {
      this.router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }
}
