import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { of } from 'rxjs';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authServiceMock: any;

  beforeEach(async () => {
    authServiceMock = {
      login: vi.fn().mockReturnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.loginForm().invalid()).toBeTruthy();
  });

  it('should validate email format', () => {
    component.loginModel.set({ email: 'test', password: '' });
    fixture.detectChanges();
    expect(component.loginForm.email().errors().some(e => e.kind === 'email')).toBeTruthy();

    component.loginModel.set({ email: 'test@example.com', password: '' });
    fixture.detectChanges();
    expect(component.loginForm.email().errors().some(e => e.kind === 'email')).toBeFalsy();
  });

  it('should be valid when filled correctly', () => {
    component.loginModel.set({ email: 'test@example.com', password: 'password123' });
    fixture.detectChanges();
    expect(component.loginForm().valid()).toBeTruthy();
  });
});
