import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../models/catalog.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-game-preview',
  imports: [CommonModule],
  templateUrl: './game-preview.html',
  styleUrls: ['./game-preview.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamePreview {
  game = input<Game | null>(null);
  closeModal = output<void>();

  private cartService = inject(CartService);

  isClosing = signal(false);

  onClose() {
    this.isClosing.set(true);
    setTimeout(() => {
      this.closeModal.emit();
      this.isClosing.set(false);
    }, 300); // Match animation duration
  }

  async addToCart() {
    const game = this.game();
    if (game) {
      await this.cartService.addToCart(game);
      this.onClose();
    }
  }
}
