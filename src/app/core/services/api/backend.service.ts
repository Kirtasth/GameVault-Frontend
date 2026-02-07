import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../enviroments/environment';
import {AuthResponseModel, CredentialsModel, RegistrationModel, UserProfileModel} from '../../models/user.model';
import {Observable} from 'rxjs';
import {TOKEN_STORAGE_KEY} from '../../utils/constants';
import {NewDeveloperModel} from '../../models/catalog.model';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private readonly http = inject(HttpClient)

  private readonly authUrl = environment.backendUrl + "/auth";
  private readonly catalogUrl = environment.backendUrl + "/catalog";

  login(credentialsModel: CredentialsModel): Observable<AuthResponseModel> {
    return this.http.post<AuthResponseModel>(`${this.authUrl}/login`, credentialsModel);
  }

  register(registration: RegistrationModel): Observable<any> {
    return this.http.post(`${this.authUrl}/register`, registration);
  }

  validateToken(): Observable<string> {
    const headers = this.getHeaders();
    return this.http.get(`${this.authUrl}`, {
      headers,
      responseType: 'text'
    })
  }

  logout(userId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.authUrl}/${userId}/logout`,
      {}, {
        headers
      })
  }

  getUserProfile(userId: number): Observable<UserProfileModel> {
    const headers = this.getHeaders();
    return this.http.get<UserProfileModel>(`${this.authUrl}/${userId}`, {
      headers
    })
  }

  registerDeveloper(developer: NewDeveloperModel): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.catalogUrl}/register-developer`, developer, {
      headers
    })
  }

  private getHeaders(): { [key: string]: string } {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem(TOKEN_STORAGE_KEY)}`
    }
  }
}
