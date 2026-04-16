import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogService } from '../../core/services/catalog.service';
import { Game, GamePage } from '../../core/models/catalog.model';
import { RouterLink } from '@angular/router';
import { GamePreview } from '../../core/components/game-preview/game-preview';
import {UserService} from '../../core/services/user.service';
import {UserRole} from '../../core/models/user.model';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, GamePreview],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private catalogService = inject(CatalogService);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  // Use rxResource for data fetching
  gamesResource = rxResource<GamePage, undefined>({
    stream: () => this.catalogService.getGames()
  });

  // Signals for state
  selectedGame = signal<Game | null>(null);

  // Computed signal for developer status
  isDeveloper = computed(() => {
    const profile = this.userService.userProfile();
    if (!profile) return false;
    return profile.roles.some(r => r.role === UserRole.DEVELOPER);
  });

  constructor() {
    // Fetch profile if authenticated but not already loaded
    if (this.authService.isAuthenticatedSignal() && !this.userService.userProfile()) {
      this.userService.fetchProfile().subscribe({
        error: (err) => console.error('Error fetching profile:', err)
      });
    }
  }

  openPreview(game: Game) {
    this.selectedGame.set(game);
  }

  closePreview() {
    this.selectedGame.set(null);
  }
}
