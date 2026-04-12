import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GamePreview } from './game-preview';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

describe('GamePreview', () => {
  let component: GamePreview;
  let fixture: ComponentFixture<GamePreview>;
  let cartServiceMock: any;

  beforeEach(async () => {
    cartServiceMock = {
      addToCart: vi.fn().mockResolvedValue(undefined),
      totalItems: { value: 0 } // Just in case it's used as a signal in some way, though here it's not
    };

    await TestBed.configureTestingModule({
      imports: [ GamePreview, CommonModule ],
      providers: [
        { provide: CartService, useValue: cartServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamePreview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
