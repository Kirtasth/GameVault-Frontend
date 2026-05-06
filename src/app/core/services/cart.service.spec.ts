import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { BackendService } from './api/backend.service';
import { CatalogService } from './catalog.service';
import { AuthService } from './auth.service';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { Game } from '../models/catalog.model';

describe('CartService', () => {
  let service: CartService;
  let backendServiceMock: Partial<BackendService>;
  let catalogServiceMock: Partial<CatalogService>;
  let authServiceMock: Partial<AuthService>;

  beforeEach(() => {
    backendServiceMock = {
      getMyCart: vi.fn().mockReturnValue(of({ id: 1, items: [] })),
      addToCart: vi.fn().mockReturnValue(of({ id: 1, items: [] })),
      removeFromCart: vi.fn().mockReturnValue(of({})),
      clearCart: vi.fn().mockReturnValue(of({}))
    };

    catalogServiceMock = {
      getGamesFromIds: vi.fn().mockReturnValue(of({ content: [] }))
    };

    authServiceMock = {
      isAuthenticatedSignal: signal(true).asReadonly(),
      isAuthenticated: vi.fn().mockReturnValue(true)
    };

    TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: BackendService, useValue: backendServiceMock },
        { provide: CatalogService, useValue: catalogServiceMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    });
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load cart on init', async () => {
    await service.loadCart();
    expect(backendServiceMock.getMyCart!).toHaveBeenCalled();
  });

  it('should return items signal', () => {
    expect(service.items()).toEqual([]);
  });

  it('should calculate total items', () => {
    expect(service.totalItems()).toBe(0);
  });

  it('should calculate total price', () => {
    expect(service.totalPrice()).toBe(0);
  });

  it('should not add a game if it is already in the cart', async () => {
    const game = { id: '1', title: 'Test Game', price: 10 } as unknown as Game;
    
    // Reset mocks
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addToCartSpy = backendServiceMock.addToCart as any;
    addToCartSpy.mockClear();

    // Mock initial state: first add succeeds
    addToCartSpy.mockReturnValue(of({
      id: 1,
      items: [{ id: 100, gameId: 1, quantity: 1, priceAtAddition: 10 }]
    }));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (catalogServiceMock.getGamesFromIds as any).mockReturnValue(of({
      content: [game]
    }));

    // First add
    await service.addToCart(game);
    expect(service.items().length).toBe(1);
    expect(backendServiceMock.addToCart).toHaveBeenCalledTimes(1);

    // Try adding again
    await service.addToCart(game);

    // It should STILL have only 1 call to the backend (the first one)
    expect(backendServiceMock.addToCart).toHaveBeenCalledTimes(1);
    expect(service.items().length).toBe(1);
    expect(service.items()[0].quantity).toBe(1);
  });
});
