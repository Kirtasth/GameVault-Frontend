import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NotImplementedComponent} from './core/components/not-implemented/not-implemented.component';
import {BackendService} from './core/services/api/backend.service';
import {rxResource} from '@angular/core/rxjs-interop';
import {catchError, of, retry} from 'rxjs';
import {LoadingSpinner} from './core/components/loading-spinner/loading-spinner';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NotImplementedComponent,
    LoadingSpinner
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly backendService = inject(BackendService);
  protected readonly isProduction = environment.build === 'pro';

  // Resource to check backend health with retries for production cold starts
  private healthResource = rxResource({
    stream: () => {
      // In development, assume backend is ready or handled by developer
      if (!this.isProduction) {
        return of({ status: 'UP' });
      }

      return this.backendService.checkHealth().pipe(
        retry({
          delay: 3000
        }),
        catchError(() => of(null))
      );
    }
  });

  protected isBackendReady = this.healthResource.value;
}
