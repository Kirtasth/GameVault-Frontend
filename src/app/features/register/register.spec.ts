import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Register } from './register';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { of } from 'rxjs';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let authServiceMock: any;

  beforeEach(async () => {
    authServiceMock = {
      isAuthenticated: vi.fn().mockReturnValue(false),
      register: vi.fn().mockReturnValue(of({})),
      login: vi.fn().mockReturnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock }
      ]
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
    expect(component.registerForm().invalid()).toBeTruthy();
  });

  it('should validate email format', () => {
    component.registerModel.update(m => ({ ...m, email: 'test' }));
    fixture.detectChanges();
    expect(component.registerForm.email().errors().some(e => e.kind === 'email')).toBeTruthy();

    component.registerModel.update(m => ({ ...m, email: 'test@example.com' }));
    fixture.detectChanges();
    expect(component.registerForm.email().errors().some(e => e.kind === 'email')).toBeFalsy();
  });

  it('should validate password match', () => {
    component.registerModel.update(m => ({ ...m, password: 'password123', confirmPassword: 'password456' }));
    fixture.detectChanges();
    expect(component.registerForm.confirmPassword().errors().some(e => e.kind === 'mismatch')).toBeTruthy();

    component.registerModel.update(m => ({ ...m, confirmPassword: 'password123' }));
    fixture.detectChanges();
    expect(component.registerForm.confirmPassword().errors().some(e => e.kind === 'mismatch')).toBeFalsy();
  });
});
