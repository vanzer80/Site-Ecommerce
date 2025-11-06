
export interface Product {
  id: number;
  name: string;
  brand: 'Tssaper' | 'Buffalo' | 'Toyama';
  categoryId: number;
  price: number;
  description: string;
  images: string[];
  stock: number;
  isFeatured: boolean;
}
