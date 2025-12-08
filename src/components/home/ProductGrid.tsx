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
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-5">
          <span className="text-4xl">🔍</span>
        </div>
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">No Products Found</h3>
        <p className="text-sm text-muted-foreground font-body max-w-[200px]">
          Try selecting a different category to discover more styles
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 px-4 pb-28">
      {products.map((product, index) => (
        <div 
          key={product.id}
          className="opacity-0 animate-reveal"
          style={{ animationDelay: `${index * 0.08}s`, animationFillMode: 'forwards' }}
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
