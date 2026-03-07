import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../models/catalog.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-game-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-preview.html',
  styleUrls: ['./game-preview.css']
})
export class GamePreview {
  @Input() game: Game | null = null;
  @Output() closeModal = new EventEmitter<void>();

  private cartService = inject(CartService);

  isClosing = false;

  onClose() {
    this.isClosing = true;
    setTimeout(() => {
      this.closeModal.emit();
      this.isClosing = false;
    }, 300); // Match animation duration
  }

  addToCart() {
    if (this.game) {
      this.cartService.addToCart(this.game).then();
      this.onClose();
    }
  }
}
