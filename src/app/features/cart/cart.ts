import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/cart.model';
import { AuthService } from '../../core/services/auth.service';
import { GameItem } from '../../core/components/game-item/game-item';
import { GamePreview } from '../../core/components/game-preview/game-preview';
import { Game } from '../../core/models/catalog.model';
import { DebounceClickDirective } from '../../core/directives/debounce-click.directive';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, GameItem, GamePreview, DebounceClickDirective],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cart implements OnInit {
  cartService = inject(CartService);
  authService = inject(AuthService);

  items = this.cartService.items;
  totalPrice = this.cartService.totalPrice;
  totalItems = this.cartService.totalItems;
  checkoutError = this.cartService.checkoutError;
  isAuthenticated = this.authService.isAuthenticatedSignal;

  selectedGame = signal<Game | null>(null);

  ngOnInit() {
    if (this.isAuthenticated()) {
      this.cartService.loadCart();
    }
  }

  openPreview(game: Game) {
    this.selectedGame.set(game);
  }

  closePreview() {
    this.selectedGame.set(null);
  }

  async removeItem(itemId: CartItem) {
    await this.cartService.removeFromCart(itemId);
  }

  async updateQuantity(itemId: CartItem, quantity: number) {
    if (quantity < 1) return;
    if (quantity > 10) return;
    await this.cartService.updateQuantity(itemId, quantity);
  }

  async clearCart() {
    await this.cartService.clearCart();
  }

  async checkout() {
    await this.cartService.checkout();
  }
}
