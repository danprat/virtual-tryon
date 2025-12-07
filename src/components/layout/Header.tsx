import { Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  userName?: string;
  location?: string;
}

export function Header({ userName = "Fashionista", location = "Jakarta, INA" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 glass safe-top">
      <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          <Button variant="icon" size="icon" className="rounded-xl">
            <Menu className="w-5 h-5" />
          </Button>
          <div>
            <p className="text-xs text-muted-foreground">Hello, {userName}</p>
            <p className="text-sm font-semibold flex items-center gap-1">
              📍 {location}
            </p>
          </div>
        </div>
        
        <Button variant="icon" size="icon" className="rounded-xl relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-primary rounded-full text-[10px] text-primary-foreground flex items-center justify-center font-bold">
            3
          </span>
        </Button>
      </div>
    </header>
  );
}
