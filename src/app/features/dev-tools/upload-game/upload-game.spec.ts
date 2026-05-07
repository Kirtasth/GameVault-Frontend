import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadGame } from './upload-game';
import { CatalogService } from '../../../core/services/catalog.service';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('UploadGame', () => {
  let component: UploadGame;
  let fixture: ComponentFixture<UploadGame>;
  let catalogServiceMock: Partial<CatalogService>;

  beforeEach(async () => {
    catalogServiceMock = {
      createGame: vi.fn().mockReturnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [UploadGame],
      providers: [
        { provide: CatalogService, useValue: catalogServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadGame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate price decimals', () => {
    // Valid integer
    component.uploadGameModel.set({ title: 'Test', description: '', price: 10, releaseDate: '' });
    fixture.detectChanges();
    expect(component.uploadGameForm.price().errors().some(e => e.kind === 'decimal')).toBeFalsy();

    // Valid 2 decimals
    component.uploadGameModel.set({ title: 'Test', description: '', price: 10.99, releaseDate: '' });
    fixture.detectChanges();
    expect(component.uploadGameForm.price().errors().some(e => e.kind === 'decimal')).toBeFalsy();

    // Invalid 3 decimals
    component.uploadGameModel.set({ title: 'Test', description: '', price: 10.999, releaseDate: '' });
    fixture.detectChanges();
    expect(component.uploadGameForm.price().errors().some(e => e.kind === 'decimal')).toBeTruthy();
  });

  it('should validate min price', () => {
    component.uploadGameModel.set({ title: 'Test', description: '', price: -1, releaseDate: '' });
    fixture.detectChanges();
    expect(component.uploadGameForm.price().errors().some(e => e.kind === 'min')).toBeTruthy();
  });
});
