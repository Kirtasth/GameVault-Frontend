import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Game } from '../../models/catalog.model';
import { AuthService } from '../../services/auth.service';
import { DebounceClickDirective } from '../../directives/debounce-click.directive';

@Component({
  selector: 'app-game-item',
  imports: [CommonModule, CurrencyPipe, DebounceClickDirective],
  template: `
    <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all duration-300">
      <div class="flex items-center gap-4">
        <div class="relative w-16 h-16 md:w-20 md:h-20 shrink-0 overflow-hidden rounded-md shadow-lg">
          <img [src]="game().imageUrl || 'assets/placeholder-game.jpg'" [alt]="game().title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
        </div>
        <div>
          <h3 class="font-bold text-white text-base md:text-lg leading-tight">{{ game().title }}</h3>
          <p class="text-peacock-teal font-semibold">{{ game().price | currency }}</p>
        </div>
      </div>

      <div class="flex items-center gap-2 md:gap-4">
        <!-- More Info Button -->
        <button (click)="moreInfo.emit()" 
                class="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
                title="More Information">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        <!-- Add to Cart / Added Button -->
        @if (isAdded()) {
          <div class="flex items-center gap-1 px-3 py-1.5 bg-peacock-teal/20 text-peacock-teal rounded-full border border-peacock-teal/30 animate-fade-in cursor-default"
               title="Already in cart">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span class="text-xs font-bold uppercase tracking-wider hidden md:inline">Added</span>
          </div>
        } @else if (isAuthenticated()) {
          <button appDebounceClick (debounceClick)="addToCart.emit()"
                  class="p-2 bg-peacock-teal text-white rounded-full shadow-md hover:bg-peacock-teal/80 hover:scale-110 active:scale-95 transition-all duration-300"
                  title="Add to Cart">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        }

        <!-- Remove Button -->
        @if (showRemove()) {
          <button appDebounceClick (debounceClick)="remove.emit()"
                  class="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-full transition-all duration-300"
                  title="Remove from Cart">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameItem {
  private authService = inject(AuthService);
  isAuthenticated = this.authService.isAuthenticatedSignal;

  game = input.required<Game>();
  isAdded = input<boolean>(false);
  showRemove = input<boolean>(false);
  
  moreInfo = output<void>();
  addToCart = output<void>();
  remove = output<void>();
}
