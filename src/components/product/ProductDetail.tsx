import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Share2, ShoppingBag, Check } from 'lucide-react';
import { Product } from '@/types/product';
import { formatPrice } from '@/data/products';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onTryOn: () => void;
}

export function ProductDetail({ product, onClose, onTryOn }: ProductDetailProps) {
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  
  const isLiked = wishlist.some(p => p.id === product.id);
  
  const handleToggleWishlist = () => {
    if (isLiked) {
      removeFromWishlist(product.id);
      toast.success('Dihapus dari wishlist');
    } else {
      addToWishlist(product);
      toast.success('Ditambahkan ke wishlist! ❤️');
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Pilih ukuran terlebih dahulu!');
      return;
    }
    const colorName = ['Putih', 'Hitam', 'Krem', 'Navy', 'Abu-abu'][selectedColor] || 'Default';
    addToCart(product, colorName, selectedSize);
    toast.success('Ditambahkan ke keranjang! 🛒');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between p-4 safe-top">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleToggleWishlist}
          >
            <Heart className={cn(
              "w-6 h-6 transition-all",
              isLiked && "fill-primary text-primary scale-110"
            )} />
          </Button>
          <Button variant="ghost" size="icon">
            <Share2 className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Product Image */}
      <div className="relative aspect-square mx-4 rounded-3xl overflow-hidden bg-gradient-card shadow-card">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-muted to-accent animate-pulse" />
        )}
        <img
          src={product.image}
          alt={product.name}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {product.isNew && (
            <span className="px-3 py-1 bg-gradient-primary text-primary-foreground text-xs font-bold rounded-full shadow-button">
              NEW ✨
            </span>
          )}
          {product.isTrending && (
            <span className="px-3 py-1 bg-foreground text-background text-xs font-bold rounded-full">
              🔥 TRENDING
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-primary text-xl font-bold mt-1">{formatPrice(product.price)}</p>
        </div>

        {/* Colors */}
        <div>
          <p className="text-sm font-medium mb-2">Warna</p>
          <div className="flex gap-3">
            {product.colors.map((color, index) => (
              <button
                key={index}
                onClick={() => setSelectedColor(index)}
                className={cn(
                  "w-10 h-10 rounded-full border-2 transition-all duration-300 relative",
                  selectedColor === index 
                    ? "border-primary scale-110 shadow-button" 
                    : "border-transparent"
                )}
                style={{ backgroundColor: color }}
              >
                {selectedColor === index && (
                  <Check className={cn(
                    "w-5 h-5 absolute inset-0 m-auto",
                    color === '#FFFFFF' ? 'text-foreground' : 'text-primary-foreground'
                  )} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div>
          <p className="text-sm font-medium mb-2">Ukuran</p>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "min-w-12 h-10 px-4 rounded-xl text-sm font-medium transition-all duration-300",
                  selectedSize === size 
                    ? "bg-gradient-primary text-primary-foreground shadow-button" 
                    : "bg-muted text-foreground hover:bg-accent"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm font-medium mb-2">Deskripsi</p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {product.name} dengan material soft dan nyaman untuk dipakai sehari-hari. 
            Cocok untuk berbagai acara casual dan tersedia dalam berbagai ukuran dan warna yang trendy.
          </p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 bg-card border-t border-border safe-bottom">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onTryOn}
            className="flex-1"
          >
            ✨ Virtual Try-On
          </Button>
          <Button 
            className="flex-1"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
