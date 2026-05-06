import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Game } from '../../models/catalog.model';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { DebounceClickDirective } from '../../directives/debounce-click.directive';

@Component({
  selector: 'app-game-preview',
  imports: [CommonModule, CurrencyPipe, DatePipe, DebounceClickDirective],
  templateUrl: './game-preview.html',
  styleUrls: ['./game-preview.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamePreview {
  private authService = inject(AuthService);
  private cartService = inject(CartService);

  game = input<Game | null>(null);
  closeModal = output<void>();

  isAuthenticated = this.authService.isAuthenticatedSignal;
  isClosing = signal(false);
  showDescription = signal(false);

  toggleDescription() {
    this.showDescription.update((v) => !v);
  }

  addToCart(game: Game) {
    this.cartService.addToCart(game);
    this.onClose();
  }

  onClose() {
    this.isClosing.set(true);
    setTimeout(() => {
      this.closeModal.emit();
      this.isClosing.set(false);
    }, 300); // Match animation duration
  }
}
