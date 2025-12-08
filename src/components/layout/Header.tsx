import { Bell, Search } from 'lucide-react';

interface HeaderProps {
  userName?: string;
}

export function Header({ userName = "Guest" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 safe-top">
      <div className="flex items-center justify-between px-4 py-3.5 max-w-lg mx-auto">
        {/* Logo / Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
            <span className="text-background font-display font-bold text-sm">V</span>
          </div>
          <div>
            <h1 className="font-display text-lg font-semibold tracking-tight leading-none">Vogue</h1>
            <p className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">Try-On</p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-foreground hover:bg-muted transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="relative w-10 h-10 rounded-full flex items-center justify-center text-foreground hover:bg-muted transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-background" />
          </button>
        </div>
      </div>
    </header>
  );
}
