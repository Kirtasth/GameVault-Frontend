export interface CartItem {
  id: number;
  gameId: number;
  quantity: number;
  priceAtAddition: number;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  status: string;
  totalPrice: number;
}

export interface UpdateCart {
  cartId: number;
  gameId: number;
  quantity: number;
}

