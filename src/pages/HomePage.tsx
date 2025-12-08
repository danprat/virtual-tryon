import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
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
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-3 pb-2">
        <HeroBanner onTryOnClick={() => navigate('/tryon')} />
      </section>
      
      {/* Categories */}
      <section>
        <CategoryTabs 
          activeCategory={activeCategory} 
          onCategoryChange={setActiveCategory} 
        />
      </section>
      
      {/* Products Section */}
      <section className="px-4 mb-5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h2 className="font-display text-lg font-semibold">Trending Now</h2>
          </div>
          <button className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors elegant-underline">
            View All
          </button>
        </div>
        <p className="text-sm text-muted-foreground font-body">
          {filteredProducts.length} items curated for you
        </p>
      </section>
      
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
