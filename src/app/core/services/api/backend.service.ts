import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../enviroments/environment';
import {AuthResponseModel, CredentialsModel, RegistrationModel} from '../../models/user.model';
import {Observable} from 'rxjs';
import {TOKEN_STORAGE_KEY} from '../../utils/constants';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private readonly http = inject(HttpClient)

  private readonly baseUrl = environment.backendUrl + "/auth";

  login(credentialsModel: CredentialsModel): Observable<AuthResponseModel> {
    return this.http.post<AuthResponseModel>(`${this.baseUrl}/login`, credentialsModel);
  }

  register(registration: RegistrationModel): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, registration);
  }

  validateToken(): Observable<string> {
    const headers = this.getHeaders();
    return this.http.get(`${this.baseUrl}`, {
      headers,
      responseType: 'text'
    })
  }

  logout(userId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${userId}/logout`, {})
  }

  private getHeaders(): { [key: string]: string} {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem(TOKEN_STORAGE_KEY)}`
    }
  }
}
