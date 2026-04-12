import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { BackendService } from './api/backend.service';
import { CatalogService } from './catalog.service';
import { of } from 'rxjs';

describe('CartService', () => {
  let service: CartService;
  let backendServiceMock: any;
  let catalogServiceMock: any;

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

    TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: BackendService, useValue: backendServiceMock },
        { provide: CatalogService, useValue: catalogServiceMock }
      ]
    });
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load cart on init', () => {
    expect(backendServiceMock.getMyCart).toHaveBeenCalled();
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
});
