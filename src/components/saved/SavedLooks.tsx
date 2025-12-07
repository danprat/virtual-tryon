import { useState } from 'react';
import { Heart, Share2, Trash2, Instagram } from 'lucide-react';
import { SavedLook } from '@/types/product';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SavedLooksProps {
  looks: SavedLook[];
  onDelete: (id: string) => void;
}

export function SavedLooks({ looks, onDelete }: SavedLooksProps) {
  const [selectedLook, setSelectedLook] = useState<string | null>(null);

  if (looks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-24 h-24 bg-gradient-hero rounded-full flex items-center justify-center mb-6 animate-float">
          <Heart className="w-12 h-12 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2">Belum ada look tersimpan</h3>
        <p className="text-muted-foreground text-sm max-w-xs">
          Coba virtual try-on dan simpan look favoritmu di sini! ✨
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-24">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Saved Looks</h2>
        <span className="text-sm text-muted-foreground">{looks.length} looks</span>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {looks.map((look) => (
          <div 
            key={look.id}
            className="relative bg-card rounded-2xl overflow-hidden shadow-soft animate-scale-in"
          >
            <div className="aspect-[3/4] relative">
              <img
                src={look.userPhoto}
                alt="Saved look"
                className="w-full h-full object-cover"
              />
              
              {/* Product Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-foreground/60 to-transparent">
                <div className="flex items-center gap-2">
                  <img 
                    src={look.product.image} 
                    alt={look.product.name}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <p className="text-primary-foreground text-xs font-medium truncate flex-1">
                    {look.product.name}
                  </p>
                </div>
              </div>

              {/* Tap overlay to toggle actions */}
              <button
                className={cn(
                  "absolute inset-0 transition-all duration-300",
                  selectedLook === look.id ? "bg-foreground/50" : "bg-transparent"
                )}
                onClick={() => setSelectedLook(selectedLook === look.id ? null : look.id)}
              />

              {/* Actions - positioned above the tap overlay */}
              {selectedLook === look.id && (
                <div className="absolute inset-0 flex items-center justify-center gap-3 pointer-events-none">
                  <Button
                    size="icon"
                    variant="glass"
                    className="w-10 h-10 rounded-full pointer-events-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.success('Membuka Instagram...');
                    }}
                  >
                    <Instagram className="w-5 h-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="glass"
                    className="w-10 h-10 rounded-full pointer-events-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.success('Link copied!');
                    }}
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="glass"
                    className="w-10 h-10 rounded-full text-destructive pointer-events-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(look.id);
                    }}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              )}
            </div>
            
            {/* Date */}
            <div className="p-2">
              <p className="text-[10px] text-muted-foreground">
                {new Date(look.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
