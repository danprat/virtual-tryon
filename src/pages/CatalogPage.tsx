import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { CategoryTabs } from '@/components/home/CategoryTabs';
import { ProductGrid } from '@/components/home/ProductGrid';
import { ProductDetail } from '@/components/product/ProductDetail';
import { TryOnCamera } from '@/components/tryon/TryOnCamera';
import { products } from '@/data/products';
import { Product } from '@/types/product';

export default function CatalogPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [showTryOn, setShowTryOn] = useState(false);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  const handleTryOn = (product: Product) => {
    setSelectedProduct(product);
    setShowTryOn(true);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
  };

  const handleSaveLook = () => {
    setShowTryOn(false);
    setSelectedProduct(null);
  };

  return (
    <div className="pb-24">
      <Header />
      <CategoryTabs 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory} 
      />
      <div className="mb-4 px-4">
        <h2 className="text-lg font-bold">🛍️ All Products</h2>
      </div>
      <ProductGrid 
        products={filteredProducts}
        onTryOn={handleTryOn}
        onProductClick={handleProductClick}
      />

      {showTryOn && (
        <TryOnCamera 
          selectedProduct={selectedProduct || undefined}
          onClose={() => {
            setShowTryOn(false);
            setSelectedProduct(null);
          }}
          onSave={handleSaveLook}
        />
      )}

      {showProductDetail && selectedProduct && (
        <ProductDetail 
          product={selectedProduct}
          onClose={() => {
            setShowProductDetail(false);
            setSelectedProduct(null);
          }}
          onTryOn={() => {
            setShowProductDetail(false);
            setShowTryOn(true);
          }}
        />
      )}
    </div>
  );
}
