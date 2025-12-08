import { Heart, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Product } from '@/types/product';
import { formatPrice } from '@/data/products';
import { cn } from '@/lib/utils';
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
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  return (
    <div 
      className="group relative bg-card rounded-xl overflow-hidden hover-lift cursor-pointer"
      onClick={() => onProductClick(product)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-muted via-background to-muted animate-shimmer" 
               style={{ backgroundSize: '200% 100%' }} />
        )}
        
        <img
          src={product.image}
          alt={product.name}
          className={cn(
            "w-full h-full object-cover transition-all duration-700 ease-out",
            "group-hover:scale-110",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
        
        {/* Badges - Editorial Style */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="px-2.5 py-1 bg-foreground text-background text-[10px] font-semibold tracking-wider uppercase">
              New In
            </span>
          )}
          {product.isTrending && (
            <span className="px-2.5 py-1 bg-primary text-primary-foreground text-[10px] font-semibold tracking-wider uppercase">
              Trending
            </span>
          )}
        </div>
        
        {/* Like Button - Minimal */}
        <button
          onClick={handleWishlistToggle}
          className={cn(
            "absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-400",
            "backdrop-blur-md border",
            isLiked 
              ? "bg-primary border-primary text-primary-foreground" 
              : "bg-background/60 border-background/20 text-foreground hover:bg-background hover:border-background"
          )}
        >
          <Heart className={cn("w-4 h-4 transition-transform", isLiked && "fill-current scale-110")} />
        </button>
        
        {/* Quick Try-On Button - Appears on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTryOn(product);
            }}
            className="w-full py-2.5 bg-background text-foreground text-xs font-semibold tracking-wide uppercase rounded-lg flex items-center justify-center gap-2 hover:bg-background/90 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Try On
          </button>
        </div>
      </div>
      
      {/* Product Info - Clean & Editorial */}
      <div className="p-3.5 space-y-2">
        <div className="space-y-1">
          <h3 className="font-display text-sm font-medium text-foreground leading-tight line-clamp-1">
            {product.name}
          </h3>
          <p className="font-body text-sm font-semibold text-foreground/80">
            {formatPrice(product.price)}
          </p>
        </div>
        
        {/* Color Options - Refined */}
        <div className="flex items-center gap-1.5 pt-1">
          {product.colors.slice(0, 4).map((color, index) => (
            <div
              key={index}
              className="w-3.5 h-3.5 rounded-full ring-1 ring-border ring-offset-1 ring-offset-card transition-transform hover:scale-125"
              style={{ backgroundColor: color }}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-[10px] text-muted-foreground font-medium ml-0.5">
              +{product.colors.length - 4}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
