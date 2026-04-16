import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotImplementedComponent } from './not-implemented.component';
import { describe, it, expect, beforeEach } from 'vitest';

describe('NotImplementedComponent', () => {
  let component: NotImplementedComponent;
  let fixture: ComponentFixture<NotImplementedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotImplementedComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NotImplementedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be closed by default', () => {
    expect(component.isOpen()).toBe(false);
    const infoBox = fixture.nativeElement.querySelector('[role="alert"]');
    expect(infoBox).toBeNull();
  });

  it('should toggle open when the button is clicked', async () => {
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.isOpen()).toBe(true);
    const infoBox = fixture.nativeElement.querySelector('[role="alert"]');
    expect(infoBox).not.toBeNull();
  });

  it('should close when the close button is clicked', async () => {
    component.isOpen.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const closeButton = fixture.nativeElement.querySelector('[role="alert"] button');
    closeButton.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.isOpen()).toBe(false);
    const infoBox = fixture.nativeElement.querySelector('[role="alert"]');
    expect(infoBox).toBeNull();
  });
});
