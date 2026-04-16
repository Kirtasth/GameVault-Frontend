import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogService } from '../../core/services/catalog.service';
import { PurchasedGameKeyResponse } from '../../core/models/catalog.model';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-purchased-games',
  imports: [CommonModule, RouterLink],
  templateUrl: './purchased-games.html',
  styleUrl: './purchased-games.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchasedGames {
  private catalogService = inject(CatalogService);

  gamesResource = rxResource<PurchasedGameKeyResponse[], undefined>({
    stream: () => this.catalogService.getPurchasedGames()
  });

  selectedGameId = signal<number | null>(null);

  toggleKey(gameId: number) {
    if (this.selectedGameId() === gameId) {
      this.selectedGameId.set(null);
    } else {
      this.selectedGameId.set(gameId);
    }
  }
}
