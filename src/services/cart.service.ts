
import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartItem[]>([]);
  
  public items = this._items.asReadonly();
  public totalItems = computed(() => this._items().reduce((acc, item) => acc + item.quantity, 0));
  public totalPrice = computed(() => this._items().reduce((acc, item) => acc + (item.product.price * item.quantity), 0));

  addToCart(product: Product, quantity: number = 1) {
    this._items.update(items => {
      const existingItem = items.find(item => item.product.id === product.id);
      if (existingItem) {
        return items.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        return [...items, { product, quantity }];
      }
    });
  }

  updateQuantity(productId: number, quantity: number) {
    this._items.update(items => 
      items.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      ).filter(item => item.quantity > 0)
    );
  }

  removeItem(productId: number) {
    this._items.update(items => items.filter(item => item.product.id !== productId));
  }

  clearCart() {
    this._items.set([]);
  }
}
