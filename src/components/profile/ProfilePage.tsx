import { Settings, Heart, ShoppingBag, HelpCircle, LogOut, ChevronRight, Camera, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const menuItems = [
  { icon: Sparkles, label: 'My Looks', count: 0, path: '/looks' },
  { icon: Heart, label: 'Wishlist', count: 0, path: '/saved' },
  { icon: ShoppingBag, label: 'Pesanan Saya', count: 0, path: '/cart' },
  { icon: Settings, label: 'Pengaturan', path: null },
  { icon: HelpCircle, label: 'Bantuan', path: null },
];

export function ProfilePage() {
  const navigate = useNavigate();

  const handleMenuClick = (item: typeof menuItems[0]) => {
    if (item.path) {
      navigate(item.path);
    } else {
      toast.info(`${item.label} - Coming soon!`);
    }
  };

  const handleLogout = () => {
    toast.success('Berhasil keluar!');
  };

  return (
    <div className="pb-24">
      {/* Profile Header */}
      <div className="bg-gradient-hero p-6 pt-8 text-center">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <div className="w-full h-full rounded-full bg-gradient-primary flex items-center justify-center text-4xl shadow-button">
            👩
          </div>
          <button 
            className="absolute bottom-0 right-0 w-8 h-8 bg-card rounded-full flex items-center justify-center shadow-soft border-2 border-background"
            onClick={() => toast.info('Ganti foto - Coming soon!')}
          >
            <Camera className="w-4 h-4 text-primary" />
          </button>
        </div>
        <h2 className="text-xl font-bold">Fashionista</h2>
        <p className="text-muted-foreground text-sm">@fashionista_id</p>
        
        {/* Stats */}
        <div className="flex justify-center gap-8 mt-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">24</p>
            <p className="text-xs text-muted-foreground">Try-Ons</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">12</p>
            <p className="text-xs text-muted-foreground">Saved</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">8</p>
            <p className="text-xs text-muted-foreground">Shared</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => handleMenuClick(item)}
              className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl shadow-soft hover:shadow-card transition-all duration-300 cursor-pointer active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <span className="flex-1 text-left font-medium">{item.label}</span>
              {item.count !== undefined && (
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                  {item.count}
                </span>
              )}
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          );
        })}
      </div>

      {/* Logout */}
      <div className="px-4 mt-4">
        <Button 
          variant="ghost" 
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Keluar
        </Button>
      </div>
    </div>
  );
}
