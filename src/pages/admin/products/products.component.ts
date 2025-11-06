import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-admin-products',
  templateUrl: './products.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CurrencyPipe, ReactiveFormsModule]
})
export class AdminProductsComponent {
  private fb = inject(FormBuilder);
  productService = inject(ProductService);
  categoryService = inject(CategoryService);

  products = this.productService.products;
  categories = this.categoryService.categories;
  brands = this.productService.brands;
  
  isFormVisible = signal(false);
  editingProduct = signal<Product | null>(null);

  productForm = this.fb.group({
    name: ['', Validators.required],
    brand: ['', Validators.required],
    categoryId: [null as number | null, Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    description: ['', Validators.required],
    images: ['', Validators.required],
    stock: [0, [Validators.required, Validators.min(0)]],
    isFeatured: [false]
  });

  showAddForm() {
    this.editingProduct.set(null);
    this.productForm.reset({ isFeatured: false, stock: 0, price: 0 });
    this.isFormVisible.set(true);
  }

  showEditForm(product: Product) {
    this.editingProduct.set(product);
    this.productForm.patchValue({
      ...product,
      images: product.images.join('\n')
    });
    this.isFormVisible.set(true);
  }

  cancelEdit() {
    this.isFormVisible.set(false);
    this.editingProduct.set(null);
    this.productForm.reset();
  }

  saveProduct() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formValue = this.productForm.value;
    const currentProduct = this.editingProduct();
    
    const productData = {
      name: formValue.name!,
      brand: formValue.brand as Product['brand'],
      categoryId: formValue.categoryId!,
      price: formValue.price!,
      description: formValue.description!,
      images: (formValue.images || '').split('\n').filter(url => url.trim() !== ''),
      stock: formValue.stock!,
      isFeatured: !!formValue.isFeatured
    };

    if (currentProduct) {
      this.productService.updateProduct({ ...productData, id: currentProduct.id });
    } else {
      this.productService.addProduct(productData);
    }
    
    this.cancelEdit();
  }

  deleteProduct(id: number) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.productService.deleteProduct(id);
    }
  }

  getCategoryName(categoryId: number): string {
    return this.categoryService.getCategoryName(categoryId);
  }
}
