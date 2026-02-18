import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {
  AuthResponseModel,
  CredentialsModel,
  RefreshTokenRequestModel,
  RegistrationModel,
  UserProfileModel
} from '../../models/user.model';
import {Observable} from 'rxjs';
import {NewDeveloperModel, NewGameModel} from '../../models/catalog.model';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private readonly http = inject(HttpClient)

  private readonly authUrl = environment.backendUrl + "/auth";
  private readonly catalogUrl = environment.backendUrl + "/catalog";
  private readonly usersUrl = environment.backendUrl + "/users";

  login(credentialsModel: CredentialsModel): Observable<AuthResponseModel> {
    return this.http.post<AuthResponseModel>(`${this.authUrl}/login`, credentialsModel);
  }

  register(registration: RegistrationModel): Observable<any> {
    return this.http.post(`${this.authUrl}/register`, registration);
  }

  validateToken(): Observable<string> {
    return this.http.get(`${this.authUrl}`, {
      responseType: 'text'
    })
  }

  logout(): Observable<any> {
    return this.http.post(`${this.authUrl}/logout`, {});
  }

  refreshToken(token: string): Observable<AuthResponseModel> {
    const body: RefreshTokenRequestModel = { refreshToken: token };
    return this.http.post<AuthResponseModel>(`${this.authUrl}/refresh`, body);
  }

  getUserProfile(userId: number): Observable<UserProfileModel> {
    return this.http.get<UserProfileModel>(`${this.usersUrl}/${userId}`);
  }

  registerDeveloper(developer: NewDeveloperModel): Observable<any> {
    return this.http.post(`${this.catalogUrl}/developer`, developer);
  }

  createGame(game: NewGameModel): Observable<any> {
    const formData = new FormData();
    formData.append('title', game.title);
    formData.append('description', game.description);
    formData.append('price', game.price.toString());
    formData.append('releaseDate', game.releaseDate.toISOString());
    formData.append('image', game.image);

    return this.http.post(`${this.catalogUrl}`, formData);
  }

  getGames(): Observable<any> {
    return this.http.get(`${this.catalogUrl}`);
  }
}
