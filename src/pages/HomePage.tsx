import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { HeroBanner } from '@/components/home/HeroBanner';
import { CategoryTabs } from '@/components/home/CategoryTabs';
import { ProductGrid } from '@/components/home/ProductGrid';
import { ProductDetail } from '@/components/product/ProductDetail';
import { TryOnCamera } from '@/components/tryon/TryOnCamera';
import { products } from '@/data/products';
import { Product } from '@/types/product';
import { useLooks } from '@/contexts/LooksContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { addLook } = useLooks();
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

  const handleSaveLook = (lookData: { userPhoto: string; product: Product }) => {
    addLook(lookData.userPhoto, lookData.product);
    // Don't close TryOn - let user see the result and close manually
  };

  return (
    <div className="pb-24">
      <Header />
      <div className="mt-2">
        <HeroBanner onTryOnClick={() => navigate('/tryon')} />
      </div>
      <CategoryTabs 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory} 
      />
      <div className="mb-4 px-4">
        <h2 className="text-lg font-bold">✨ Trending Now</h2>
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
