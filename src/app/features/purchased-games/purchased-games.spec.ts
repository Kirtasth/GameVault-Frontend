import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PurchasedGames } from './purchased-games';
import { CatalogService } from '../../core/services/catalog.service';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { PurchasedGameKeyResponse } from '../../core/models/catalog.model';
import { Component } from '@angular/core';
import { Sidebar } from '../../core/components/sidebar/sidebar';

// Mock Sidebar component
@Component({
  selector: 'app-sidebar',
  standalone: true,
  template: '<div id="mock-sidebar"></div>'
})
class MockSidebar {}

describe('PurchasedGames', () => {
  let component: PurchasedGames;
  let fixture: ComponentFixture<PurchasedGames>;
  let catalogServiceMock: any;

  const mockGames: PurchasedGameKeyResponse[] = [
    {
      gameId: 1,
      gameTitle: 'Game 1',
      imageUrl: 'url1',
      keyValue: 'key-123',
      purchasedAt: '2021-01-01T00:00:00Z'
    },
    {
      gameId: 2,
      gameTitle: 'Game 2',
      imageUrl: 'url2',
      keyValue: 'key-456',
      purchasedAt: '2021-01-02T00:00:00Z'
    }
  ];

  beforeEach(async () => {
    catalogServiceMock = {
      getPurchasedGames: vi.fn().mockReturnValue(of(mockGames))
    };

    await TestBed.configureTestingModule({
      imports: [PurchasedGames],
      providers: [
        provideRouter([]),
        { provide: CatalogService, useValue: catalogServiceMock }
      ]
    })
    .overrideComponent(PurchasedGames, {
      remove: { imports: [Sidebar] },
      add: { imports: [MockSidebar] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchasedGames);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load purchased games on init', () => {
    expect(catalogServiceMock.getPurchasedGames).toHaveBeenCalled();
    expect(component.gamesResource.value()).toEqual(mockGames);
  });

  it('should toggle selectedGameId when toggleKey is called', () => {
    expect(component.selectedGameId()).toBeNull();

    component.toggleKey(1);
    expect(component.selectedGameId()).toBe(1);

    component.toggleKey(1);
    expect(component.selectedGameId()).toBeNull();

    component.toggleKey(2);
    expect(component.selectedGameId()).toBe(2);
  });

  it('should show the key in the template when selected', () => {
    component.toggleKey(1);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('key-123');
    expect(compiled.textContent).toContain('Activation Key');
  });

  it('should not show the key when not selected', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).not.toContain('key-123');
    expect(compiled.textContent).toContain('View Key');
  });
});
