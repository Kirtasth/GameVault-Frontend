import {inject, Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import {UserService} from '../services/user.service';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DeveloperGuard implements CanActivate, CanActivateChild {

  private readonly userService = inject(UserService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    return this.checkRole();
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    return this.checkRole();
  }

  private checkRole(): Observable<boolean> {
    return this.userService.isUserDeveloper();
  }
}
