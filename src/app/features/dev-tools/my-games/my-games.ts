import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogService } from '../../../core/services/catalog.service';
import { Game, GamePage } from '../../../core/models/catalog.model';
import { rxResource } from '@angular/core/rxjs-interop';
import { AddKeysComponent } from './add-keys/add-keys';

@Component({
  selector: 'app-my-games',
  imports: [CommonModule, AddKeysComponent],
  templateUrl: './my-games.html',
  styleUrl: './my-games.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyGames {
  navigateToUpload = output<void>();

  private catalogService = inject(CatalogService);

  selectedGameForKeys = signal<Game | null>(null);

  gamesResource = rxResource<GamePage, undefined>({
    stream: () => this.catalogService.getMyGames()
  });

  onUploadFirstGame() {
    this.navigateToUpload.emit();
  }

  onAddKeys(game: Game) {
    this.selectedGameForKeys.set(game);
  }

  onKeysAdded() {
    this.selectedGameForKeys.set(null);
    this.gamesResource.reload();
  }

  onCancelAddKeys() {
    this.selectedGameForKeys.set(null);
  }
}
