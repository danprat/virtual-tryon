import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { toast } from 'sonner';
import { Product } from '@/types/product';

export default function SavedPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleRemoveFromWishlist = (id: string) => {
    removeFromWishlist(id);
    toast.success('Dihapus dari wishlist');
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, product.colors[0], product.sizes[0]);
    toast.success('Ditambahkan ke keranjang');
  };

  if (wishlist.length === 0) {
    return (
      <div className="pb-24">
        <Header />
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-24 h-24 bg-gradient-hero rounded-full flex items-center justify-center mb-6 animate-float">
            <Heart className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Wishlist kosong</h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            Simpan produk favoritmu di sini dengan tap ikon ❤️
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <Header />
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Wishlist</h1>
            <p className="text-muted-foreground text-sm">{wishlist.length} produk tersimpan</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="relative bg-card rounded-2xl overflow-hidden shadow-soft animate-scale-in"
            >
              <div className="aspect-square relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleRemoveFromWishlist(product.id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
              
              <div className="p-3">
                <h3 className="font-medium text-sm truncate">{product.name}</h3>
                <p className="text-primary font-bold text-sm mt-1">
                  Rp {product.price.toLocaleString('id-ID')}
                </p>
                <Button
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}