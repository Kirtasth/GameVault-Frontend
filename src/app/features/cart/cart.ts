import {Component, inject, OnInit} from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {CartService} from '../../core/services/cart.service';
import {Sidebar} from '../../core/components/sidebar/sidebar';
import {CartItem} from '../../core/models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe, Sidebar],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  cartService = inject(CartService);

  items = this.cartService.items;
  totalPrice = this.cartService.totalPrice;
  totalItems = this.cartService.totalItems;

  ngOnInit() {
    this.cartService.loadCart();
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

  checkout() {
    // TODO: Implement checkout logic
    console.log('Checkout clicked');
  }
}
