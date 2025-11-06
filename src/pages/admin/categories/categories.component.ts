import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-admin-categories',
  template: `
    <div class="p-2">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Gerenciar Categorias</h1>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Form Section -->
        <div class="md:col-span-1">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-semibold mb-4 text-gray-700">{{ editCategory() ? 'Editar Categoria' : 'Adicionar Categoria' }}</h2>
            <form [formGroup]="categoryForm" (ngSubmit)="saveCategory()">
              <div class="mb-4">
                <label for="name" class="block text-gray-600 text-sm font-medium mb-2">Nome</label>
                <input type="text" id="name" formControlName="name" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                @if (categoryForm.get('name')?.invalid && categoryForm.get('name')?.touched) {
                  <p class="text-red-500 text-xs mt-1">O nome é obrigatório.</p>
                }
              </div>
              <div class="mb-4">
                <label for="imageUrl" class="block text-gray-600 text-sm font-medium mb-2">URL da Imagem</label>
                <input type="text" id="imageUrl" formControlName="imageUrl" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                 @if (categoryForm.get('imageUrl')?.invalid && categoryForm.get('imageUrl')?.touched) {
                  <p class="text-red-500 text-xs mt-1">A URL da imagem é obrigatória.</p>
                }
              </div>
              <div class="flex items-center space-x-4">
                 <button type="submit" [disabled]="categoryForm.invalid" class="bg-primary hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">
                  {{ editCategory() ? 'Salvar' : 'Adicionar' }}
                </button>
                @if (editCategory()) {
                  <button type="button" (click)="cancelEdit()" class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg transition duration-300">
                    Cancelar
                  </button>
                }
              </div>
            </form>
          </div>
        </div>

        <!-- List Section -->
        <div class="md:col-span-2">
          <div class="bg-white shadow-md rounded-lg overflow-x-auto">
            <table class="w-full table-auto">
              <thead class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <tr>
                  <th class="py-3 px-6 text-left">ID</th>
                  <th class="py-3 px-6 text-left">Imagem</th>
                  <th class="py-3 px-6 text-left">Nome</th>
                  <th class="py-3 px-6 text-center">Ações</th>
                </tr>
              </thead>
              <tbody class="text-gray-600 text-sm font-light">
                @for (category of categories(); track category.id) {
                  <tr class="border-b border-gray-200 hover:bg-gray-50">
                    <td class="py-3 px-6 text-left">{{ category.id }}</td>
                    <td class="py-3 px-6 text-left">
                      <img [src]="category.imageUrl" [alt]="category.name" class="w-12 h-12 object-cover rounded">
                    </td>
                    <td class="py-3 px-6 text-left font-medium">{{ category.name }}</td>
                    <td class="py-3 px-6 text-center">
                      <div class="flex item-center justify-center space-x-2">
                         <button (click)="startEdit(category)" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transform hover:scale-110 transition-transform duration-200">
                           ✏️
                         </button>
                         <button (click)="deleteCategory(category.id)" class="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 transform hover:scale-110 transition-transform duration-200">
                           🗑️
                         </button>
                      </div>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="4" class="text-center py-6 text-gray-500">Nenhuma categoria encontrada.</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule]
})
export class AdminCategoriesComponent {
  private fb = inject(FormBuilder);
  categoryService = inject(CategoryService);

  categories = this.categoryService.categories;
  editCategory = signal<Category | null>(null);

  categoryForm = this.fb.group({
    name: ['', Validators.required],
    imageUrl: ['', Validators.required],
  });

  startEdit(category: Category) {
    this.editCategory.set(category);
    this.categoryForm.setValue({
      name: category.name,
      imageUrl: category.imageUrl,
    });
  }

  cancelEdit() {
    this.editCategory.set(null);
    this.categoryForm.reset();
  }

  saveCategory() {
    if (this.categoryForm.invalid) {
      return;
    }

    const formValue = this.categoryForm.value;
    const currentCategory = this.editCategory();

    if (currentCategory) {
      // Update
      const updatedCategory: Category = {
        id: currentCategory.id,
        name: formValue.name!,
        imageUrl: formValue.imageUrl!,
      };
      this.categoryService.updateCategory(updatedCategory);
    } else {
      // Add
      this.categoryService.addCategory(formValue.name!, formValue.imageUrl!);
    }

    this.cancelEdit(); // Reset form and edit state
  }

  deleteCategory(id: number) {
    if (confirm('Tem certeza que deseja excluir esta categoria? Isso pode afetar produtos existentes.')) {
      this.categoryService.deleteCategory(id);
    }
  }
}
