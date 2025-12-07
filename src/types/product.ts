export type ProductCategory = 'shirts' | 'pants' | 'jackets';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  image: string;
  colors: string[];
  sizes: string[];
  isNew?: boolean;
  isTrending?: boolean;
}

export interface SavedLook {
  id: string;
  userPhoto: string;
  product: Product;
  createdAt: Date;
  isFavorite: boolean;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  savedLooks: SavedLook[];
}
