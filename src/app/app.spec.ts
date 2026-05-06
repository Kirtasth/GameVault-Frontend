import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { BackendService } from './core/services/api/backend.service';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('App', () => {
  let mockBackendService: Partial<BackendService>;

  beforeEach(async () => {
    mockBackendService = {
      checkHealth: vi.fn().mockReturnValue(of({ status: 'UP' }))
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: BackendService, useValue: mockBackendService },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have a router-outlet', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
