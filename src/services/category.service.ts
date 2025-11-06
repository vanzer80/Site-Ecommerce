
import { Injectable, signal } from '@angular/core';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private _categories = signal<Category[]>([]);
  public categories = this._categories.asReadonly();

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    const initialCategories: Category[] = [
      { id: 1, name: "Ferramentas Elétricas", imageUrl: "https://picsum.photos/seed/cat1/400/300" },
      { id: 2, name: "Motores e Geradores", imageUrl: "https://picsum.photos/seed/cat2/400/300" },
      { id: 3, name: "Equipamentos de Construção", imageUrl: "https://picsum.photos/seed/cat3/400/300" },
      { id: 4, name: "Máquinas Agrícolas", imageUrl: "https://picsum.photos/seed/cat4/400/300" },
      { id: 5, name: "Limpeza e Jardinagem", imageUrl: "https://picsum.photos/seed/cat5/400/300" },
      { id: 6, name: "Motobombas", imageUrl: "https://picsum.photos/seed/cat6/400/300" }
    ];
    this._categories.set(initialCategories);
  }

  getCategoryName(id: number): string {
    return this._categories().find(c => c.id === id)?.name || 'Sem Categoria';
  }

  addCategory(name: string, imageUrl: string) {
    const newCategory: Category = {
        id: Math.max(...this._categories().map(c => c.id), 0) + 1,
        name,
        imageUrl
    };
    this._categories.update(categories => [...categories, newCategory]);
  }

  updateCategory(updatedCategory: Category) {
    this._categories.update(categories => 
      categories.map(c => c.id === updatedCategory.id ? updatedCategory : c)
    );
  }

  deleteCategory(id: number) {
    this._categories.update(categories => categories.filter(c => c.id !== id));
  }
}
