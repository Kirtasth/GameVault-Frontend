import { ChangeDetectionStrategy, Component, inject, signal, computed, HostListener } from '@angular/core';
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

  groupedGames = computed(() => {
    const games = this.gamesResource.value() || [];
    const grouped = new Map<number, { gameId: number, gameTitle: string, imageUrl: string, keys: { value: string, purchasedAt: string }[] }>();

    games.forEach(g => {
      if (!grouped.has(g.gameId)) {
        grouped.set(g.gameId, {
          gameId: g.gameId,
          gameTitle: g.gameTitle,
          imageUrl: g.imageUrl,
          keys: []
        });
      }
      grouped.get(g.gameId)!.keys.push({ value: g.keyValue, purchasedAt: g.purchasedAt });
    });

    return Array.from(grouped.values());
  });

  selectedGameId = signal<number | null>(null);
  visibleKey = signal<string | null>(null);
  copiedKey = signal<string | null>(null);

  toggleGame(gameId: number) {
    if (this.selectedGameId() === gameId) {
      this.selectedGameId.set(null);
    } else {
      this.selectedGameId.set(gameId);
    }
    this.visibleKey.set(null);
  }

  revealKey(event: Event, key: string) {
    event.stopPropagation();
    this.visibleKey.set(key);
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.visibleKey.set(null);
  }

  copyToClipboard(event: Event, key: string) {
    event.stopPropagation();
    navigator.clipboard.writeText(key);
    this.copiedKey.set(key);
    setTimeout(() => {
      if (this.copiedKey() === key) {
        this.copiedKey.set(null);
      }
    }, 2000);
  }
}
