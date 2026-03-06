import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GamePreview } from './game-preview';
import { CommonModule } from '@angular/common';

describe('GamePreview', () => {
  let component: GamePreview;
  let fixture: ComponentFixture<GamePreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ GamePreview, CommonModule ]
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
