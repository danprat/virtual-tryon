import { Product } from '@/types/product';

export const products: Product[] = [
  // Shirts
  {
    id: 'shirt-1',
    name: 'Casual V-Neck',
    price: 125000,
    category: 'shirts',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop',
    colors: ['#F8BBD9', '#B3E5FC', '#FFFFFF'],
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: true,
  },
  {
    id: 'shirt-2',
    name: 'Casual T-Shirt',
    price: 150000,
    category: 'shirts',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
    colors: ['#FFFFFF', '#FFE0B2', '#C8E6C9'],
    sizes: ['S', 'M', 'L'],
    isTrending: true,
  },
  {
    id: 'shirt-3',
    name: 'Oversized Tee',
    price: 135000,
    category: 'shirts',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=500&fit=crop',
    colors: ['#E1BEE7', '#FFCCBC', '#B2DFDB'],
    sizes: ['M', 'L', 'XL'],
  },
  {
    id: 'shirt-4',
    name: 'Crop Top',
    price: 95000,
    category: 'shirts',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=500&fit=crop',
    colors: ['#F8BBD9', '#81D4FA'],
    sizes: ['XS', 'S', 'M'],
    isNew: true,
  },
  // Pants
  {
    id: 'pants-1',
    name: 'Wide Leg Jeans',
    price: 285000,
    category: 'pants',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=500&fit=crop',
    colors: ['#90CAF9', '#1976D2'],
    sizes: ['26', '28', '30', '32'],
    isTrending: true,
  },
  {
    id: 'pants-2',
    name: 'Cargo Pants',
    price: 320000,
    category: 'pants',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop',
    colors: ['#8D6E63', '#455A64', '#C5E1A5'],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'pants-3',
    name: 'Mom Jeans',
    price: 265000,
    category: 'pants',
    image: 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=400&h=500&fit=crop',
    colors: ['#64B5F6', '#E3F2FD'],
    sizes: ['26', '28', '30'],
    isNew: true,
  },
  // Jackets
  {
    id: 'jacket-1',
    name: 'Pink Blazer',
    price: 450000,
    category: 'jackets',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop',
    colors: ['#F8BBD9', '#CE93D8', '#FFFFFF'],
    sizes: ['S', 'M', 'L'],
    isTrending: true,
  },
  {
    id: 'jacket-2',
    name: 'Denim Jacket',
    price: 385000,
    category: 'jackets',
    image: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=400&h=500&fit=crop',
    colors: ['#64B5F6', '#1976D2'],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'jacket-3',
    name: 'Hoodie',
    price: 275000,
    category: 'jackets',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop',
    colors: ['#F8BBD9', '#B39DDB', '#80CBC4'],
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: true,
  },
  {
    id: 'jacket-4',
    name: 'Puffer Jacket',
    price: 520000,
    category: 'jackets',
    image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=500&fit=crop',
    colors: ['#F48FB1', '#CE93D8', '#80DEEA'],
    sizes: ['S', 'M', 'L'],
  },
];

export const categories = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'shirts', label: 'Shirts', icon: '👕' },
  { id: 'pants', label: 'Pants', icon: '👖' },
  { id: 'jackets', label: 'Jackets', icon: '🧥' },
];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};
