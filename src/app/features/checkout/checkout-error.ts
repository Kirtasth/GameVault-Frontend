import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Sidebar } from '../../core/components/sidebar/sidebar';

@Component({
  selector: 'app-checkout-error',
  standalone: true,
  imports: [RouterLink, Sidebar],
  templateUrl: './checkout-error.html',
  styleUrl: './checkout-error.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutError {}
