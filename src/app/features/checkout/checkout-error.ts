import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checkout-error',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './checkout-error.html',
  styleUrl: './checkout-error.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutError {}
