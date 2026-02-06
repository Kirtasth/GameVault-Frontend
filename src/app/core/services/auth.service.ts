import {inject, Injectable} from '@angular/core';
import {BackendService} from "./api/backend.service";
import {AuthResponseModel, CredentialsModel, RegistrationModel} from '../models/user.model';
import {map, Observable} from 'rxjs';
import {TOKEN_STORAGE_KEY, USER_ID_STORAGE_KEY} from '../utils/constants';

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

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): Observable<any> {
    const userId = this.getUserId();
    return this.backendService.logout(Number(userId)).pipe(
      map(() => {
        localStorage.removeItem(USER_ID_STORAGE_KEY);
        localStorage.removeItem(TOKEN_STORAGE_KEY);

        return 'OK';
      })
    );
  }
}
