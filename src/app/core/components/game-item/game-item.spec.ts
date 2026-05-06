import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameItem } from './game-item';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Game } from '../../models/catalog.model';
import { By } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { signal } from '@angular/core';

describe('GameItem', () => {
  let component: GameItem;
  let fixture: ComponentFixture<GameItem>;
  let authServiceMock: Partial<AuthService>;

  const mockGame: Game = {
    id: '1',
    title: 'Test Game',
    description: 'Test Description',
    price: 59.99,
    imageUrl: 'test.jpg',
    developerId: 'dev1',
    releaseDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['Action'],
    statuses: ['Active'],
    keysAvailable: 100
  };

  beforeEach(async () => {
    authServiceMock = {
      isAuthenticatedSignal: signal(true).asReadonly()
    };

    await TestBed.configureTestingModule({
      imports: [ GameItem, CommonModule, CurrencyPipe ],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameItem);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('game', mockGame);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display game title and price', () => {
    const title = fixture.debugElement.query(By.css('h3')).nativeElement.textContent;
    const price = fixture.debugElement.query(By.css('p')).nativeElement.textContent;
    
    expect(title).toBe(mockGame.title);
    expect(price).toContain('59.99');
  });

  it('should emit moreInfo when info button is clicked', () => {
    const spy = vi.spyOn(component.moreInfo, 'emit');
    const infoButton = fixture.debugElement.query(By.css('button[title="More Information"]'));
    infoButton.nativeElement.click();
    
    expect(spy).toHaveBeenCalled();
  });

  it('should emit addToCart when cart button is clicked and not added', () => {
    fixture.componentRef.setInput('isAdded', false);
    fixture.detectChanges();

    const spy = vi.spyOn(component.addToCart, 'emit');
    const cartButton = fixture.debugElement.query(By.css('button[title="Add to Cart"]'));
    cartButton.nativeElement.click();
    
    expect(spy).toHaveBeenCalled();
  });

  it('should show "Added" state and not emit addToCart when isAdded is true', () => {
    fixture.componentRef.setInput('isAdded', true);
    fixture.detectChanges();

    const addedState = fixture.debugElement.query(By.css('.bg-peacock-teal\\/20'));
    expect(addedState.nativeElement.textContent).toContain('Added');
    
    const cartButton = fixture.debugElement.query(By.css('button[title="Add to Cart"]'));
    expect(cartButton).toBeFalsy();
  });

  it('should emit remove when remove button is clicked', () => {
    fixture.componentRef.setInput('showRemove', true);
    fixture.detectChanges();

    const spy = vi.spyOn(component.remove, 'emit');
    const removeButton = fixture.debugElement.query(By.css('button[title="Remove from Cart"]'));
    removeButton.nativeElement.click();
    
    expect(spy).toHaveBeenCalled();
  });
});
