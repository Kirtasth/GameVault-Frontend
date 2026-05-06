import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebounceClickDirective } from './debounce-click.directive';
import { By } from '@angular/platform-browser';

@Component({
  template: `<button appDebounceClick (debounceClick)="onClick()">Click Me</button>`,
  imports: [DebounceClickDirective]
})
class TestComponent {
  clicks = 0;
  onClick() {
    this.clicks++;
  }
}

describe('DebounceClickDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent, DebounceClickDirective]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit once immediately on first click', () => {
    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();
    expect(component.clicks).toBe(1);
  });

  it('should ignore subsequent clicks within 500ms', async () => {
    const button = fixture.debugElement.query(By.css('button'));
    
    button.nativeElement.click();
    button.nativeElement.click();
    button.nativeElement.click();
    
    expect(component.clicks).toBe(1);
    
    await new Promise(resolve => setTimeout(resolve, 501));
    
    button.nativeElement.click();
    expect(component.clicks).toBe(2);
  });
});
