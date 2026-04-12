import {inject, Injectable, signal} from '@angular/core';
import {forkJoin, map, Observable, of, switchMap, tap, throwError} from 'rxjs';
import {GameKeyResponse, GamePage, NewDeveloperModel, NewGameModel} from '../models/catalog.model';
import {BackendService} from './api/backend.service';
import {AuthService} from './auth.service';
import {UserRole} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  private readonly backendService = inject(BackendService);
  private readonly authService = inject(AuthService);

  private isDeveloperSignal = signal<boolean | null>(null);
  readonly isDeveloper = this.isDeveloperSignal.asReadonly();

  getGames(): Observable<GamePage> {
    return this.backendService.getGames().pipe(
      map(response => response as GamePage)
    );
  }

  registerDeveloper(developer: NewDeveloperModel): Observable<unknown> {
    return this.backendService.registerDeveloper(developer).pipe(
      tap(() => this.isDeveloperSignal.set(true))
    );
  }

  isUserDeveloper(): Observable<boolean> {
    if (this.isDeveloperSignal() !== null) {
      return of(this.isDeveloperSignal()!);
    }

    const userId = this.authService.getUserId();

    if (!userId) {
      return throwError(() => new Error('User ID not found'));
    }

    return this.backendService.getUserProfile(userId).pipe(
      map(userProfile => {
        const hasDevAccess = userProfile.roles.some(
          role => role.role === UserRole.DEVELOPER || role.role === UserRole.ADMIN
        );
        this.isDeveloperSignal.set(hasDevAccess);
        return hasDevAccess;
      })
    );
  }

  clearCache() {
    this.isDeveloperSignal.set(null);
  }

  createGame(game: NewGameModel): Observable<unknown> {
    return this.backendService.createGame(game);
  }

  getMyGames(): Observable<GamePage> {
    const userId = this.authService.getUserId();
    console.log('CatalogService.getMyGames for userId:', userId);

    if (!userId) {
      console.error('CatalogService.getMyGames: User ID not found');
      return throwError(() => new Error('User ID not found'));
    }

    return this.backendService.getMyGames().pipe(
      map(response => response as GamePage),
      switchMap(page => {
        if (page.content.length === 0) return of(page);

        const gamesWithKeys$ = page.content.map(game =>
          this.backendService.getGameKeys(game.id).pipe(
            map(keys => ({
              ...game,
              keysAvailable: (keys as GameKeyResponse[]).filter(k => !k.isUsed).length
            }))
          )
        );

        return forkJoin(gamesWithKeys$).pipe(
          map(content => ({ ...page, content }))
        );
      })
    );
  }

  getPurchasedGames(): Observable<GamePage> {
    return this.backendService.getPurchasedGames().pipe(
      map(response => response as GamePage)
    )
  }

  getGamesFromIds(gameIds: number[]): Observable<GamePage> {
    return this.backendService.getGamesFromIds({ ids: gameIds }).pipe(
      map(response => response as GamePage)
    );
  }

  addKeysToGame(gameId: string, keys: string[]): Observable<unknown> {
    return this.backendService.addKeysToGame(gameId, keys);
  }

  getGameKeys(gameId: string): Observable<GameKeyResponse[]> {
    return this.backendService.getGameKeys(gameId);
  }
}
