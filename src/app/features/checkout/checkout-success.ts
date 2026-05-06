import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './checkout-success.html',
  styleUrl: './checkout-success.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutSuccess implements OnInit {
  private readonly cartService = inject(CartService);

  ngOnInit() {
    // Clear the cart after a successful payment
    this.cartService.clearCart();
  }
}
