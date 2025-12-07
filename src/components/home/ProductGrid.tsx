import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onTryOn: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

export function ProductGrid({ products, onTryOn, onProductClick }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Tidak ada produk</h3>
        <p className="text-sm text-muted-foreground">Coba pilih kategori lain ya!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 px-4 pb-24">
      {products.map((product, index) => (
        <div 
          key={product.id}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <ProductCard 
            product={product} 
            onTryOn={onTryOn}
            onProductClick={onProductClick}
          />
        </div>
      ))}
    </div>
  );
}
