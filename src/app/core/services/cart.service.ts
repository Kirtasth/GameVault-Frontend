import { Injectable, signal, computed, inject } from '@angular/core';
import { Game } from '../models/catalog.model';
import { Cart, CartItem, UpdateCart } from '../models/cart.model';
import { BackendService } from './api/backend.service';
import { CatalogService } from './catalog.service';
import { firstValueFrom } from 'rxjs';

export interface CartItemWithGame extends CartItem {
  game: Game;
}

export interface CartWithGames extends Omit<Cart, 'items'> {
  items: CartItemWithGame[];
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private _cart = signal<CartWithGames | null>(null);
  private backendService = inject(BackendService);
  private catalogService = inject(CatalogService);

  readonly cart = this._cart.asReadonly();

  readonly items = computed(() => this._cart()?.items ?? []);
  readonly totalItems = computed(() => this.items().reduce((acc, item) => acc + item.quantity, 0));
  readonly totalPrice = computed(() => this.items().reduce((acc, item) => acc + (item.game.price * item.quantity), 0));

  constructor() {
    this.loadCart();
  }

  async loadCart() {
    try {
      const cart = await firstValueFrom(this.backendService.getMyCart());
      if (cart) {
        const enrichedCart = await this.enrichCartWithGames(cart);
        this._cart.set(enrichedCart);
      } else {
        this._cart.set(null);
      }
    } catch (error) {
      console.error('Failed to load cart', error);
      this._cart.set(null);
    }
  }

  private async enrichCartWithGames(cart: Cart): Promise<CartWithGames> {
    if (!cart.items || cart.items.length === 0) {
      return { ...cart, items: [] };
    }

    const gameIds = cart.items.map(item => item.gameId);
    const uniqueGameIds = [...new Set(gameIds)];

    if (uniqueGameIds.length === 0) {
         return { ...cart, items: [] };
    }

    try {
      const gamesPage = await firstValueFrom(this.catalogService.getGamesFromIds(uniqueGameIds));
      const games = gamesPage.content;

      const enrichedItems: CartItemWithGame[] = cart.items.map(item => {
        const game = games.find(g => Number(g.id) === item.gameId);
        if (!game) return null;
        return { ...item, game };
      }).filter((item): item is CartItemWithGame => item !== null);

      return { ...cart, items: enrichedItems };
    } catch (error) {
      console.error('Failed to fetch games for cart items', error);
      return { ...cart, items: [] };
    }
  }

  async addToCart(game: Game) {
    const previousCart = this._cart();
    const gameIdNum = Number(game.id);

    let newCartState: CartWithGames;

    if (previousCart) {
        const existingItemIndex = previousCart.items.findIndex(item => item.game.id === game.id);
        const newItems = [...previousCart.items];

        if (existingItemIndex > -1) {
            const item = newItems[existingItemIndex];
            newItems[existingItemIndex] = { ...item, quantity: item.quantity + 1 };
        } else {
            newItems.push({
                id: 0, // Temp ID
                gameId: gameIdNum,
                quantity: 1,
                priceAtAddition: game.price,
                game: game
            });
        }
        newCartState = { ...previousCart, items: newItems };
    } else {
        newCartState = {
            id: 0,
            userId: 0,
            items: [{
                id: 0,
                gameId: gameIdNum,
                quantity: 1,
                priceAtAddition: game.price,
                game: game
            }],
            status: 'OPEN',
            totalPrice: game.price
        };
    }

    this._cart.set(newCartState);

    try {
      const updatePayload: UpdateCart = {
        cartId: previousCart?.id ?? 0,
        gameId: gameIdNum,
        quantity: (previousCart?.items.find(i => i.game.id === game.id)?.quantity ?? 0) + 1
      };

      const updatedCartRaw = await firstValueFrom(this.backendService.addToCart(updatePayload));
      const enrichedCart = await this.enrichCartWithGames(updatedCartRaw);
      this._cart.set(enrichedCart);

    } catch (error) {
      console.error('Failed to add to cart. Reverting.', error);
      this._cart.set(previousCart);
    }
  }

  async removeFromCart(item: CartItem) {
    const previousCart = this._cart();
    if (!previousCart) return;

    const newItems = previousCart.items.filter(i => i.id !== item.id);
    this._cart.set({ ...previousCart, items: newItems });

    try {
      await firstValueFrom(this.backendService.removeFromCart(Number(item.id)));
    } catch (error) {
      console.error('Failed to remove from cart. Reverting.', error);
      this._cart.set(previousCart);
    }
  }

  async updateQuantity(item: CartItem, quantity: number) {
    if (quantity <= 0) {
      await this.removeFromCart(item);
      return;
    }

    const previousCart = this._cart();
    if (!previousCart) return;

    const newItems = previousCart.items.map(i =>
        i.id === item.id ? { ...item, quantity } : item
    ) as CartItemWithGame[];

    this._cart.set({ ...previousCart, items: newItems });

    try {
      const updatePayload: UpdateCart = {
        cartId: previousCart.id,
        gameId: item.gameId,
        quantity: quantity
      };
      const updatedCartRaw = await firstValueFrom(this.backendService.addToCart(updatePayload));
      const enrichedCart = await this.enrichCartWithGames(updatedCartRaw);
      this._cart.set(enrichedCart);
    } catch (error) {
      console.error('Failed to update quantity. Reverting.', error);
      this._cart.set(previousCart);
    }
  }

  async clearCart() {
    const previousCart = this._cart();
    if (!previousCart) return;

    this._cart.set({ ...previousCart, items: [] });

    try {
      await firstValueFrom(this.backendService.clearCart());
    } catch (error) {
      console.error('Failed to clear cart. Reverting.', error);
      this._cart.set(previousCart);
    }
  }
}
