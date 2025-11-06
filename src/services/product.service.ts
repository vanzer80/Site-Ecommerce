
import { Injectable, signal, computed, effect } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private _products = signal<Product[]>([]);

  public products = this._products.asReadonly();
  public featuredProducts = computed(() => this._products().filter(p => p.isFeatured));
  public brands = ['Tssaper', 'Buffalo', 'Toyama'] as const;

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    const initialProducts: Product[] = [
        { id: 1, name: "Serra Tico-Tico 800W", brand: "Tssaper", categoryId: 1, price: 289.90, description: "Potente serra tico-tico para cortes precisos em diversos materiais.", images: ["https://picsum.photos/seed/p1/600/600", "https://picsum.photos/seed/p1_2/600/600"], stock: 15, isFeatured: true },
        { id: 2, name: "Esmerilhadeira Angular 7\"", brand: "Tssaper", categoryId: 1, price: 349.90, description: "Esmerilhadeira angular robusta para trabalhos pesados de corte e desbaste.", images: ["https://picsum.photos/seed/p2/600/600"], stock: 8, isFeatured: true },
        { id: 3, name: "Lavadora Alta Pressão 1800 PSI", brand: "Tssaper", categoryId: 5, price: 599.90, description: "Limpeza eficiente e rápida com a lavadora de alta pressão Tssaper.", images: ["https://picsum.photos/seed/p3/600/600"], stock: 5, isFeatured: false },
        { id: 4, name: "Furadeira de Impacto 850W", brand: "Tssaper", categoryId: 1, price: 259.90, description: "Furadeira de impacto com alta potência para perfurações em concreto e alvenaria.", images: ["https://picsum.photos/seed/p4/600/600"], stock: 12, isFeatured: true },
        { id: 5, name: "Motor Gasolina 6.5HP", brand: "Buffalo", categoryId: 2, price: 1299.90, description: "Motor a gasolina confiável e potente para diversas aplicações.", images: ["https://picsum.photos/seed/p5/600/600"], stock: 6, isFeatured: true },
        { id: 6, name: "Pulverizador Costal 20L", brand: "Buffalo", categoryId: 4, price: 189.90, description: "Pulverizador costal com capacidade de 20 litros, ideal para agricultura e jardinagem.", images: ["https://picsum.photos/seed/p6/600/600"], stock: 20, isFeatured: false },
        { id: 7, name: "Motobomba 2\"", brand: "Buffalo", categoryId: 6, price: 899.90, description: "Motobomba de 2 polegadas para transferência de água com alta vazão.", images: ["https://picsum.photos/seed/p7/600/600"], stock: 4, isFeatured: false },
        { id: 8, name: "Compactador de Solo", brand: "Buffalo", categoryId: 3, price: 2499.90, description: "Equipamento essencial para compactação de solo em obras de construção civil.", images: ["https://picsum.photos/seed/p8/600/600"], stock: 3, isFeatured: true },
        { id: 9, name: "Gerador 3000W", brand: "Toyama", categoryId: 2, price: 1899.90, description: "Gerador de energia Toyama, garantindo eletricidade onde você precisar.", images: ["https://picsum.photos/seed/p9/600/600"], stock: 7, isFeatured: true },
        { id: 10, name: "Motosserra 52CC", brand: "Toyama", categoryId: 5, price: 799.90, description: "Motosserra potente e segura para corte de árvores e lenha.", images: ["https://picsum.photos/seed/p10/600/600"], stock: 10, isFeatured: true },
        { id: 11, name: "Roçadeira 52CC", brand: "Toyama", categoryId: 5, price: 699.90, description: "Roçadeira lateral a gasolina, ideal para limpeza de terrenos e jardins.", images: ["https://picsum.photos/seed/p11/600/600"], stock: 15, isFeatured: false },
        { id: 12, name: "Cortadora de Piso 14\"", brand: "Toyama", categoryId: 3, price: 3299.90, description: "Máquina de cortar piso e asfalto com motor potente e disco de 14 polegadas.", images: ["https://picsum.photos/seed/p12/600/600"], stock: 2, isFeatured: true }
      ];
    this._products.set(initialProducts);
  }

  getProductById(id: number) {
    return this.products().find(p => p.id === id);
  }

  addProduct(product: Omit<Product, 'id'>) {
    const newProduct: Product = {
      ...product,
      id: Math.max(...this._products().map(p => p.id), 0) + 1
    };
    this._products.update(products => [...products, newProduct]);
  }

  updateProduct(updatedProduct: Product) {
    this._products.update(products => 
      products.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
  }

  deleteProduct(id: number) {
    this._products.update(products => products.filter(p => p.id !== id));
  }
}
