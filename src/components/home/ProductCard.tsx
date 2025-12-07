import { Heart } from 'lucide-react';
import { useState } from 'react';
import { Product } from '@/types/product';
import { formatPrice } from '@/data/products';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/contexts/WishlistContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  onTryOn: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

export function ProductCard({ product, onTryOn, onProductClick }: ProductCardProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isLiked = isInWishlist(product.id);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiked) {
      removeFromWishlist(product.id);
      toast.success('Dihapus dari wishlist');
    } else {
      addToWishlist(product);
      toast.success('Ditambahkan ke wishlist');
    }
  };

  return (
    <div 
      className="group relative bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 animate-scale-in"
      onClick={() => onProductClick(product)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-card">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-muted to-accent animate-pulse" />
        )}
        <img
          src={product.image}
          alt={product.name}
          className={cn(
            "w-full h-full object-cover transition-all duration-500 group-hover:scale-105",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="px-2 py-0.5 bg-gradient-primary text-primary-foreground text-[10px] font-bold rounded-full">
              NEW
            </span>
          )}
          {product.isTrending && (
            <span className="px-2 py-0.5 bg-foreground text-background text-[10px] font-bold rounded-full">
              🔥 HOT
            </span>
          )}
        </div>
        
        {/* Like Button */}
        <button
          onClick={handleWishlistToggle}
          className={cn(
            "absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
            isLiked 
              ? "bg-primary text-primary-foreground scale-110" 
              : "bg-card/80 backdrop-blur-sm text-foreground hover:bg-primary hover:text-primary-foreground"
          )}
        >
          <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
        </button>
        
        {/* Quick Try-On Button */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onTryOn(product);
            }}
            size="sm"
            className="w-full text-xs"
          >
            ✨ Try On Now
          </Button>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-3">
        <h3 className="font-semibold text-sm text-foreground truncate">{product.name}</h3>
        <p className="text-primary font-bold text-sm mt-1">{formatPrice(product.price)}</p>
        
        {/* Color Options */}
        <div className="flex gap-1 mt-2">
          {product.colors.slice(0, 3).map((color, index) => (
            <div
              key={index}
              className="w-4 h-4 rounded-full border-2 border-card shadow-sm"
              style={{ backgroundColor: color }}
            />
          ))}
          {product.colors.length > 3 && (
            <span className="text-[10px] text-muted-foreground ml-1">
              +{product.colors.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
