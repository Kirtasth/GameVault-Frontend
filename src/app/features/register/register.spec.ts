import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Register } from './register';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register, ReactiveFormsModule],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('should validate email format', () => {
    const email = component.registerForm.controls['email'];
    email.setValue('test');
    expect(email.errors?.['email']).toBeTruthy();
    email.setValue('test@example.com');
    expect(email.errors).toBeNull();
  });

  it('should validate password match', () => {
    component.registerForm.controls['password'].setValue('password123');
    component.registerForm.controls['confirmPassword'].setValue('password456');
    // Trigger validation update
    component.registerForm.updateValueAndValidity();

    expect(component.registerForm.hasError('mismatch')).toBeTruthy();

    component.registerForm.controls['confirmPassword'].setValue('password123');
    component.registerForm.updateValueAndValidity();

    expect(component.registerForm.hasError('mismatch')).toBeFalsy();
  });
});
