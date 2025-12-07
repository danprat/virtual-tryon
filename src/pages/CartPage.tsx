import { Header } from '@/components/layout/Header';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();

  const handleCheckout = () => {
    toast.success('Checkout coming soon! 🛒');
  };

  if (items.length === 0) {
    return (
      <div className="pb-24">
        <Header />
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground text-center">
            Start shopping and add items to your cart!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32">
      <Header />
      <div className="px-4 py-4">
        <h1 className="text-2xl font-bold mb-4">🛒 Your Cart</h1>
        
        <div className="space-y-4">
          {items.map((item) => (
            <div 
              key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
              className="bg-card rounded-2xl p-4 shadow-soft flex gap-4"
            >
              <img 
                src={item.product.image} 
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded-xl"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.selectedColor} • {item.selectedSize}
                </p>
                <p className="text-primary font-bold mt-1">
                  Rp {item.product.price.toLocaleString('id-ID')}
                </p>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold w-8 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-destructive p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Checkout Footer */}
      <div className="fixed bottom-20 left-0 right-0 bg-card border-t border-border p-4 safe-bottom">
        <div className="max-w-lg mx-auto">
          <div className="flex justify-between mb-4">
            <span className="text-muted-foreground">Total</span>
            <span className="text-xl font-bold">Rp {totalPrice.toLocaleString('id-ID')}</span>
          </div>
          <Button onClick={handleCheckout} className="w-full" size="lg">
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
