
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, FormsModule, ProductCardComponent]
})
export class ProductsComponent {
  productService = inject(ProductService);
  categoryService = inject(CategoryService);
  // FIX: Explicitly cast injected ActivatedRoute to its type to resolve a potential type inference issue where it is treated as 'unknown'.
  private route = inject(ActivatedRoute) as ActivatedRoute;

  allProducts = this.productService.products;
  categories = this.categoryService.categories;
  brands = this.productService.brands;

  // Filter signals
  searchTerm = signal('');
  selectedCategories = signal<number[]>([]);
  selectedBrands = signal<string[]>([]);
  priceRange = signal<{ min: number; max: number }>({ min: 0, max: 5000 });
  sortOrder = signal<'priceAsc' | 'priceDesc' | 'latest'>('latest');

  filteredProducts = computed(() => {
    let products = this.allProducts();

    // Search
    if (this.searchTerm()) {
      products = products.filter(p => p.name.toLowerCase().includes(this.searchTerm().toLowerCase()));
    }

    // Category
    if (this.selectedCategories().length > 0) {
      products = products.filter(p => this.selectedCategories().includes(p.categoryId));
    }

    // Brand
    if (this.selectedBrands().length > 0) {
      products = products.filter(p => this.selectedBrands().includes(p.brand));
    }

    // Price
    products = products.filter(p => p.price >= this.priceRange().min && p.price <= this.priceRange().max);

    // Sorting
    switch (this.sortOrder()) {
      case 'priceAsc':
        products = products.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        products = products.sort((a, b) => b.price - a.price);
        break;
      case 'latest':
        products = products.sort((a, b) => b.id - a.id);
        break;
    }

    return products;
  });

  constructor() {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategories.set([+params['category']]);
      }
    });
  }
  
  onCategoryChange(categoryId: number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectedCategories.update(cats => 
      isChecked ? [...cats, categoryId] : cats.filter(c => c !== categoryId)
    );
  }

  onBrandChange(brand: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectedBrands.update(brands =>
      isChecked ? [...brands, brand] : brands.filter(b => b !== brand)
    );
  }

  clearFilters() {
    this.searchTerm.set('');
    this.selectedCategories.set([]);
    this.selectedBrands.set([]);
    this.priceRange.set({ min: 0, max: 5000 });
    this.sortOrder.set('latest');
  }

  isCategorySelected(categoryId: number): boolean {
    return this.selectedCategories().includes(categoryId);
  }

  isBrandSelected(brand: string): boolean {
    return this.selectedBrands().includes(brand);
  }

}
