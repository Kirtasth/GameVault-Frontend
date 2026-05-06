import { TestBed } from '@angular/core/testing';
import { CatalogService } from './catalog.service';
import { BackendService } from './api/backend.service';
import { AuthService } from './auth.service';
import { firstValueFrom, of } from 'rxjs';
import { UserRole } from '../models/user.model';
import { PurchasedGameKeyResponse } from '../models/catalog.model';

describe('CatalogService', () => {
  let service: CatalogService;
  let backendServiceMock: Partial<BackendService>;
  let authServiceMock: Partial<AuthService>;

  beforeEach(() => {
    backendServiceMock = {
      getGames: vi.fn().mockReturnValue(of({ content: [] })),
      registerDeveloper: vi.fn().mockReturnValue(of({})),
      getUserProfile: vi.fn().mockReturnValue(of({ roles: [{ role: UserRole.DEVELOPER }] })),
      getPurchasedGames: vi.fn().mockReturnValue(of([]))
    };

    authServiceMock = {
      getUserId: vi.fn().mockReturnValue(1)
    };

    TestBed.configureTestingModule({
      providers: [
        CatalogService,
        { provide: BackendService, useValue: backendServiceMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    });
    service = TestBed.inject(CatalogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch games', async () => {
    const games = await firstValueFrom(service.getGames());
    expect(games).toBeTruthy();
    expect(backendServiceMock.getGames!).toHaveBeenCalled();
  });

  it('should check if user is developer', async () => {
    const isDev = await firstValueFrom(service.isUserDeveloper());
    expect(isDev).toBeTruthy();
    expect(service.isDeveloper()).toBeTruthy();
  });

  it('should clear cache', () => {
    service.clearCache();
    expect(service.isDeveloper()).toBeNull();
  });

  it('should fetch purchased games with keys', async () => {
    const mockPurchasedGames: PurchasedGameKeyResponse[] = [
      {
        gameId: 1,
        gameTitle: 'Game 1',
        imageUrl: 'url1',
        keyValue: 'key1',
        purchasedAt: '2021-01-01T00:00:00Z'
      }
    ];
    backendServiceMock.getPurchasedGames = vi.fn().mockReturnValue(of(mockPurchasedGames));

    const result = await firstValueFrom(service.getPurchasedGames());
    
    expect(result).toEqual(mockPurchasedGames);
    expect(backendServiceMock.getPurchasedGames!).toHaveBeenCalled();
  });
});
