import {inject, Injectable} from '@angular/core';
import {BackendService} from "./api/backend.service";
import {AuthResponseModel, CredentialsModel, RegistrationModel} from '../models/user.model';
import {finalize, map, Observable, throwError} from 'rxjs';
import {REFRESH_TOKEN_STORAGE_KEY, TOKEN_STORAGE_KEY, USER_ID_STORAGE_KEY} from '../utils/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly backendService = inject(BackendService);

  login(credentials: CredentialsModel): Observable<any> {
    return this.backendService.login(credentials).pipe(
      map((response: AuthResponseModel) => {
        localStorage.setItem(USER_ID_STORAGE_KEY, String(response.userId))
        localStorage.setItem(TOKEN_STORAGE_KEY, response.accessToken);
        localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, response.refreshToken);

        return 'OK';
      })
    );
  }

  register(registration: RegistrationModel): Observable<any> {
    return this.backendService.register(registration);
  }

  validateToken(): Observable<string> {
    return this.backendService.validateToken();
  }

  getUserId(): number | null {
    return localStorage.getItem(USER_ID_STORAGE_KEY) ? Number(localStorage.getItem(USER_ID_STORAGE_KEY)) : null;
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): Observable<any> {
    return this.backendService.logout().pipe(
      finalize(() => {
        this.purgeAuth();
      })
    );
  }

  purgeAuth(): void {
    localStorage.removeItem(USER_ID_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }
    return this.backendService.refreshToken(refreshToken).pipe(
      map((response: AuthResponseModel) => {
        localStorage.setItem(TOKEN_STORAGE_KEY, response.accessToken);
        localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, response.refreshToken);
        return response;
      })
    );
  }
}
