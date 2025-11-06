
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CurrencyPipe, RouterLink]
})
export class CartComponent {
  cartService = inject(CartService);

  items = this.cartService.items;
  totalPrice = this.cartService.totalPrice;

  updateQuantity(productId: number, event: Event) {
    const newQuantity = +(event.target as HTMLInputElement).value;
    if (newQuantity >= 0) {
      this.cartService.updateQuantity(productId, newQuantity);
    }
  }

  removeItem(productId: number) {
    this.cartService.removeItem(productId);
  }
}
