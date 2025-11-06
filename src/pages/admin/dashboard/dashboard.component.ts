
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink]
})
export class AdminDashboardComponent {
  productService = inject(ProductService);
  categoryService = inject(CategoryService);
}
