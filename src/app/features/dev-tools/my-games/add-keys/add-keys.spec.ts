import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddKeysComponent } from './add-keys';
import { CatalogService } from '../../../../core/services/catalog.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Game } from '../../../../core/models/catalog.model';

describe('AddKeysComponent', () => {
  let component: AddKeysComponent;
  let fixture: ComponentFixture<AddKeysComponent>;
  let catalogServiceSpy: {
    addKeysToGame: ReturnType<typeof vi.fn>;
  };

  const mockGame: Game = {
    id: '1',
    title: 'Test Game',
    description: 'Test Description',
    price: 10,
    imageUrl: 'test.jpg',
    developerId: 'dev1',
    releaseDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [],
    statuses: [],
    keysAvailable: 5,
  };

  beforeEach(async () => {
    catalogServiceSpy = {
      addKeysToGame: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AddKeysComponent, ReactiveFormsModule],
      providers: [
        { provide: CatalogService, useValue: catalogServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddKeysComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('game', mockGame);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit if form is empty', async () => {
    await component.onSubmit();
    expect(catalogServiceSpy.addKeysToGame).not.toHaveBeenCalled();
  });

  it('should split keys by newline and call service', async () => {
    catalogServiceSpy.addKeysToGame.mockReturnValue(of({}));
    const keysAddedSpy = vi.spyOn(component.keysAdded, 'emit');

    component.keysForm.controls.keys.setValue('KEY1\nKEY2\n  KEY3  ');
    await component.onSubmit();

    expect(catalogServiceSpy.addKeysToGame).toHaveBeenCalledWith('1', ['KEY1', 'KEY2', 'KEY3']);
    expect(keysAddedSpy).toHaveBeenCalled();
  });

  it('should show error message if service fails', async () => {
    catalogServiceSpy.addKeysToGame.mockReturnValue(throwError(() => new Error('API Error')));

    component.keysForm.controls.keys.setValue('KEY1');
    await component.onSubmit();

    expect(component.errorMessage()).toBe('Failed to add keys. Please try again.');
    expect(component.isSubmitting()).toBe(false);
  });

  it('should emit cancel event when onCancel is called', () => {
    const cancelSpy = vi.spyOn(component.cancelAction, 'emit');
    component.onCancel();
    expect(cancelSpy).toHaveBeenCalled();
  });
});
