import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ProductCardComponent, CommonModule]
})
export class HomeComponent {
  productService = inject(ProductService);
  categoryService = inject(CategoryService);

  featuredProducts = this.productService.featuredProducts;
  categories = this.categoryService.categories;
  brands = [
    { name: 'Tssaper', logo: 'https://via.placeholder.com/150/6B7280/FFFFFF?text=Tssaper' },
    { name: 'Buffalo', logo: 'https://via.placeholder.com/150/6B7280/FFFFFF?text=Buffalo' },
    { name: 'Toyama', logo: 'https://via.placeholder.com/150/D9232A/FFFFFF?text=Toyama' },
  ];
}