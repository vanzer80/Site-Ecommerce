
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CurrencyPipe, CommonModule]
})
export class ProductDetailComponent {
  // FIX: Explicitly cast injected ActivatedRoute to its type to resolve a potential type inference issue where it is treated as 'unknown'.
  private route = inject(ActivatedRoute) as ActivatedRoute;
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  quantity = signal(1);
  selectedImage = signal('');

  product = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    const product = this.productService.getProductById(Number(id));
    if (product?.images[0]) {
      this.selectedImage.set(product.images[0]);
    }
    return product;
  });

  incrementQuantity() {
    this.quantity.update(q => q + 1);
  }

  decrementQuantity() {
    this.quantity.update(q => (q > 1 ? q - 1 : 1));
  }

  addToCart() {
    const p = this.product();
    if (p) {
      this.cartService.addToCart(p, this.quantity());
    }
  }

  changeImage(imageUrl: string) {
    this.selectedImage.set(imageUrl);
  }
}
