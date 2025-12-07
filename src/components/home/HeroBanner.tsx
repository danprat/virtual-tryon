import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroBannerProps {
  onTryOnClick: () => void;
}

export function HeroBanner({ onTryOnClick }: HeroBannerProps) {
  return (
    <div className="relative mx-4 rounded-3xl bg-gradient-hero overflow-hidden shadow-card animate-slide-up">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-4 right-4 w-20 h-20 bg-primary/30 rounded-full blur-2xl" />
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-primary/20 rounded-full blur-xl" />
      </div>
      
      <div className="relative p-6 flex items-center gap-4">
        <div className="flex-1">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
            <Sparkles className="w-3 h-3" />
            AI Try-On
          </div>
          <h2 className="text-xl font-bold text-foreground mb-1">
            Virtual Try-On
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Coba outfit favoritmu secara virtual dengan AI! 📸
          </p>
          <Button onClick={onTryOnClick} size="sm" className="rounded-full px-6">
            Coba Sekarang
          </Button>
        </div>
        
        <div className="relative w-24 h-24 animate-float">
          <div className="absolute inset-0 bg-gradient-primary rounded-2xl opacity-20 blur-xl" />
          <div className="relative w-full h-full bg-gradient-primary rounded-2xl flex items-center justify-center text-4xl shadow-button">
            👗
          </div>
        </div>
      </div>
    </div>
  );
}
