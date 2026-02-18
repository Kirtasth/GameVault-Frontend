import {inject, Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {GamePage, NewDeveloperModel, NewGameModel} from '../models/catalog.model';
import {BackendService} from './api/backend.service';
import {AuthService} from './auth.service';
import {UserRole} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  private readonly backendService = inject(BackendService);
  private readonly authService = inject(AuthService);

  getGames(): Observable<GamePage> {
    return this.backendService.getGames().pipe(
      map(response => response as GamePage)
    );
  }

  registerDeveloper(developer: NewDeveloperModel): Observable<any> {
    return this.backendService.registerDeveloper(developer);
  }

  isUserDeveloper(): Observable<boolean> {
    const userId = this.authService.getUserId();

    if (!userId) {
      throw new Error('User ID not found');
    }

    return this.backendService.getUserProfile(userId).pipe(
      map(userProfile => userProfile.roles.some(role => role.role === UserRole.DEVELOPER))
    );
  }

  createGame(game: NewGameModel): Observable<any> {
    return this.backendService.createGame(game);
  }
}
