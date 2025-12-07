import { Home, Grid3X3, ShoppingCart, Heart, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';

const navItems = [
  { id: 'home', path: '/', icon: Home, label: 'Home' },
  { id: 'catalog', path: '/catalog', icon: Grid3X3, label: 'Catalog' },
  { id: 'cart', path: '/cart', icon: ShoppingCart, label: 'Cart' },
  { id: 'saved', path: '/saved', icon: Heart, label: 'Saved' },
  { id: 'profile', path: '/profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border safe-bottom">
      <div className="flex items-center justify-around py-2 px-4 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          const isCart = item.id === 'cart';

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300",
                isCart 
                  ? "relative -mt-6" 
                  : "",
                isActive && !isCart && "text-primary",
                !isActive && !isCart && "text-muted-foreground hover:text-foreground"
              )}
            >
              {isCart ? (
                <div className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center shadow-button transition-all duration-300 relative",
                  isActive 
                    ? "bg-gradient-primary scale-110" 
                    : "bg-gradient-primary opacity-80 hover:opacity-100"
                )}>
                  <Icon className="w-6 h-6 text-primary-foreground" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
                      {totalItems > 9 ? '9+' : totalItems}
                    </span>
                  )}
                </div>
              ) : (
                <>
                  <Icon className={cn(
                    "w-5 h-5 transition-transform duration-300",
                    isActive && "scale-110"
                  )} />
                  <span className={cn(
                    "text-[10px] font-medium transition-opacity duration-300",
                    isActive ? "opacity-100" : "opacity-70"
                  )}>
                    {item.label}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
