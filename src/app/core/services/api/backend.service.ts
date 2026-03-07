import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {
  AuthResponseModel,
  CredentialsModel,
  RefreshTokenRequestModel,
  RegistrationModel, UpdatedProfile,
  UserProfileModel
} from '../../models/user.model';
import {Observable} from 'rxjs';
import {CustomGameIds, GamePage, NewDeveloperModel, NewGameModel} from '../../models/catalog.model';
import {Cart, UpdateCart} from '../../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private readonly http = inject(HttpClient)

  private readonly authUrl = environment.backendUrl + "/auth";
  private readonly catalogUrl = environment.backendUrl + "/catalog";
  private readonly usersUrl = environment.backendUrl + "/users";
  private readonly cartUrl = environment.backendUrl + "/cart";

  login(credentialsModel: CredentialsModel): Observable<AuthResponseModel> {
    return this.http.post<AuthResponseModel>(`${this.authUrl}/login`, credentialsModel);
  }

  register(registration: RegistrationModel): Observable<unknown> {
    return this.http.post(`${this.authUrl}/register`, registration);
  }

  validateToken(): Observable<string> {
    return this.http.get(`${this.authUrl}`, {
      responseType: 'text'
    })
  }

  logout(): Observable<unknown> {
    return this.http.post(`${this.authUrl}/logout`, {});
  }

  refreshToken(token: string): Observable<AuthResponseModel> {
    const body: RefreshTokenRequestModel = { refreshToken: token };
    return this.http.post<AuthResponseModel>(`${this.authUrl}/refresh`, body);
  }

  getUserProfile(userId: number): Observable<UserProfileModel> {
    return this.http.get<UserProfileModel>(`${this.usersUrl}/${userId}`);
  }

  updateUserProfile(userId: number, updatedUser: UpdatedProfile): Observable<UserProfileModel> {
    const formData = new FormData();
    formData.append('username', updatedUser.username);
    formData.append('email', updatedUser.email);
    formData.append('password', updatedUser.password);
    formData.append('bio', updatedUser.bio);
    if (updatedUser.avatarImage) {
      formData.append('avatarImage', updatedUser.avatarImage);
    }

    return this.http.put<UserProfileModel>(`${this.usersUrl}/${userId}`, formData);
  }

  registerDeveloper(developer: NewDeveloperModel): Observable<unknown> {
    return this.http.post(`${this.catalogUrl}/developer`, developer);
  }

  createGame(game: NewGameModel): Observable<unknown> {
    const formData = new FormData();
    formData.append('title', game.title);
    formData.append('description', game.description);
    formData.append('price', game.price.toString());
    formData.append('releaseDate', game.releaseDate.toISOString());
    formData.append('image', game.image);

    return this.http.post(`${this.catalogUrl}`, formData);
  }

  getGames(): Observable<GamePage> {
    return this.http.get<GamePage>(`${this.catalogUrl}`);
  }

  getMyGames(): Observable<GamePage> {
    return this.http.get<GamePage>(`${this.catalogUrl}/my-games`);
  }

  getPurchasedGames(): Observable<GamePage> {
    return this.http.get<GamePage>(`${this.catalogUrl}/purchased-games`);
  }

  getGamesFromIds(gameIds: CustomGameIds): Observable<GamePage> {
    return this.http.post<GamePage>(`${this.catalogUrl}/custom-game-list`, gameIds);
  }

  getMyCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.cartUrl}`);
  }

  addToCart(updateCart: UpdateCart): Observable<Cart> {
    return this.http.post<Cart>(`${this.cartUrl}`, updateCart);
  }

  removeFromCart(itemId: number): Observable<unknown> {
    return this.http.delete(`${this.cartUrl}/items/${itemId}`);
  }

  clearCart(): Observable<unknown> {
    return this.http.delete(`${this.cartUrl}`);
  }


}
