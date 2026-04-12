import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../core/components/sidebar/sidebar';
import { CatalogService } from '../../core/services/catalog.service';
import { GamePage } from '../../core/models/catalog.model';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-purchased-games',
  imports: [CommonModule, Sidebar, RouterLink],
  templateUrl: './purchased-games.html',
  styleUrl: './purchased-games.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchasedGames {
  private catalogService = inject(CatalogService);

  gamesResource = rxResource<GamePage, undefined>({
    stream: () => this.catalogService.getPurchasedGames()
  });
}
