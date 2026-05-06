import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PurchasedGames } from './purchased-games';
import { CatalogService } from '../../core/services/catalog.service';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { PurchasedGameKeyResponse } from '../../core/models/catalog.model';
import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { Observable } from 'rxjs';

describe('PurchasedGames', () => {
  let component: PurchasedGames;
  let fixture: ComponentFixture<PurchasedGames>;
  let catalogServiceMock: {
    getPurchasedGames: Mock<() => Observable<PurchasedGameKeyResponse[]>>;
  };

  const mockGames: PurchasedGameKeyResponse[] = [
    {
      gameId: 1,
      gameTitle: 'Game 1',
      imageUrl: 'url1',
      keyValue: 'key-123',
      purchasedAt: '2021-01-01T00:00:00Z'
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
    .compileComponents();

    fixture = TestBed.createComponent(PurchasedGames);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Mock clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide keys by default', () => {
    component.toggleGame(1);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('••••-••••-••••-••••');
    expect(compiled.textContent).not.toContain('key-123');
  });

  it('should reveal key when clicking eye icon', () => {
    component.toggleGame(1);
    fixture.detectChanges();

    const eyeButton = fixture.nativeElement.querySelector('button[title="Reveal key"]');
    eyeButton.click();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('key-123');
    expect(compiled.textContent).not.toContain('••••-••••-••••-••••');
  });

  it('should hide key when clicking elsewhere', () => {
    component.toggleGame(1);
    component.visibleKey.set('key-123');
    fixture.detectChanges();

    document.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();

    expect(component.visibleKey()).toBeNull();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('••••-••••-••••-••••');
  });

  it('should show "Copied!" and checkmark when copying', async () => {
    vi.useFakeTimers();
    component.toggleGame(1);
    fixture.detectChanges();

    const copyButton = Array.from(fixture.nativeElement.querySelectorAll('button'))
      .find(b => (b as HTMLElement).textContent?.includes('Copy')) as HTMLButtonElement;
    
    copyButton.click();
    fixture.detectChanges();

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('key-123');
    expect(component.copiedKey()).toBe('key-123');
    expect(fixture.nativeElement.textContent).toContain('Copied!');

    vi.advanceTimersByTime(2000);
    fixture.detectChanges();

    expect(component.copiedKey()).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Copy');
    vi.useRealTimers();
  });
});
