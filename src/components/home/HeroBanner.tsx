import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroBannerProps {
  onTryOnClick: () => void;
}

export function HeroBanner({ onTryOnClick }: HeroBannerProps) {
  return (
    <div className="relative mx-4 overflow-hidden animate-slide-up">
      {/* Main Hero Card */}
      <div className="relative rounded-2xl overflow-hidden bg-foreground text-background min-h-[200px]">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/60 rounded-full blur-2xl" />
          <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3"/>
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="relative p-6 flex items-center gap-5">
          {/* Content */}
          <div className="flex-1 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/10 backdrop-blur-sm border border-background/10">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium tracking-wide uppercase">AI-Powered</span>
            </div>
            
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight leading-tight">
                Virtual
                <br />
                <span className="text-gradient-gold">Try-On</span>
              </h2>
            </div>
            
            <p className="text-sm text-background/70 font-body leading-relaxed max-w-[200px]">
              Experience fashion like never before with AI magic
            </p>
            
            <Button 
              onClick={onTryOnClick} 
              size="sm" 
              className="group mt-2 rounded-full px-5 bg-background text-foreground hover:bg-background/90 font-medium"
            >
              <span>Try Now</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          
          {/* Visual Element */}
          <div className="relative w-28 h-28 flex-shrink-0">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-gold rounded-2xl opacity-40 blur-xl animate-pulse-soft" />
            
            {/* Main visual */}
            <div className="relative w-full h-full rounded-2xl bg-gradient-gold p-0.5 animate-float shadow-glow">
              <div className="w-full h-full rounded-[14px] bg-foreground/90 flex items-center justify-center overflow-hidden">
                <div className="text-5xl">👗</div>
              </div>
            </div>
            
            {/* Decorative dots */}
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-primary rounded-full animate-pulse-soft" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-background rounded-full" />
          </div>
        </div>
        
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-gold" />
      </div>
    </div>
  );
}
