import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogService } from '../../../core/services/catalog.service';
import { Game } from '../../../core/models/catalog.model';
import { timeout, catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-my-games',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-games.html',
  styleUrl: './my-games.css',
})
export class MyGames implements OnInit {
  @Output() navigateToUpload = new EventEmitter<void>();

  // Using Signals for robust change detection in Angular 21
  games = signal<Game[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  private catalogService = inject(CatalogService);

  ngOnInit() {
    this.loadGames();
  }

  loadGames() {
    console.log('--- loadGames started ---');
    this.isLoading.set(true);
    this.errorMessage.set(null);
    
    try {
      this.catalogService.getMyGames().pipe(
        timeout(10000),
        catchError(err => {
          console.error('Request timed out or failed in pipe:', err);
          return throwError(() => err);
        })
      ).subscribe({
        next: (response: any) => {
          console.log('--- Data received in component ---', response);
          
          let gameList: Game[] = [];
          if (response && response.content) {
            gameList = response.content || [];
          } else if (Array.isArray(response)) {
            gameList = response;
          } else {
            console.warn('Unexpected response format:', response);
          }
          
          this.games.set(gameList);
          this.isLoading.set(false);
          console.log('isLoading signal set to false. Current value:', this.isLoading());
        },
        error: (err) => {
          console.error('--- Error in subscription ---', err);
          this.errorMessage.set('Could not load games. Please try again later.');
          this.isLoading.set(false);
        },
        complete: () => {
          console.log('--- Observable completed ---');
          // Double check to ensure spinner is gone
          this.isLoading.set(false);
        }
      });
    } catch (err) {
      console.error('Unexpected synchronous error:', err);
      this.isLoading.set(false);
    }
  }

  onUploadFirstGame() {
    this.navigateToUpload.emit();
  }
}
