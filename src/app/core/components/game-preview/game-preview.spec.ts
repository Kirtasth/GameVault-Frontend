import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GamePreview } from './game-preview';
import { CommonModule } from '@angular/common';
import { Game } from '../../models/catalog.model';
import { By } from '@angular/platform-browser';

describe('GamePreview', () => {
  let component: GamePreview;
  let fixture: ComponentFixture<GamePreview>;

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
    tags: ['Action', 'RPG'],
    statuses: ['Active'],
    keysAvailable: 100
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ GamePreview, CommonModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamePreview);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('game', mockGame);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have description hidden by default', () => {
    const description = fixture.debugElement.query(By.css('p.text-gray-700'));
    expect(description).toBeFalsy();
    expect(component.showDescription()).toBe(false);
  });

  it('should show description when toggle button is clicked', () => {
    const toggleButton = fixture.debugElement.query(By.css('button[title="Toggle Description"]'));
    toggleButton.nativeElement.click();
    fixture.detectChanges();

    const description = fixture.debugElement.query(By.css('p.text-gray-700'));
    expect(description).toBeTruthy();
    expect(description.nativeElement.textContent.trim()).toBe(mockGame.description);
    expect(component.showDescription()).toBe(true);
  });

  it('should close the modal when adding to cart', () => {
    const game = mockGame;
    const closeSpy = vi.spyOn(component, 'onClose');
    
    component.addToCart(game);
    
    expect(closeSpy).toHaveBeenCalled();
  });
});
