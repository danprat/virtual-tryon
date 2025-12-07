import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SavedLook, Product } from '@/types/product';

interface LooksContextType {
  looks: SavedLook[];
  addLook: (userPhoto: string, product: Product) => void;
  removeLook: (id: string) => void;
}

const LooksContext = createContext<LooksContextType | undefined>(undefined);

const LOOKS_STORAGE_KEY = 'fashion-looks';

export function LooksProvider({ children }: { children: ReactNode }) {
  const [looks, setLooks] = useState<SavedLook[]>(() => {
    try {
      const saved = localStorage.getItem(LOOKS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(LOOKS_STORAGE_KEY, JSON.stringify(looks));
  }, [looks]);

  const addLook = (userPhoto: string, product: Product) => {
    console.log('Adding look to context...', { productName: product.name });
    const newLook: SavedLook = {
      id: `look-${Date.now()}`,
      userPhoto,
      product,
      createdAt: new Date(),
      isFavorite: false,
    };
    setLooks(prev => {
      const updated = [newLook, ...prev];
      console.log('Looks updated, total:', updated.length);
      return updated;
    });
  };

  const removeLook = (id: string) => {
    setLooks(prev => prev.filter(look => look.id !== id));
  };

  return (
    <LooksContext.Provider value={{ looks, addLook, removeLook }}>
      {children}
    </LooksContext.Provider>
  );
}

export function useLooks() {
  const context = useContext(LooksContext);
  if (!context) {
    throw new Error('useLooks must be used within a LooksProvider');
  }
  return context;
}
