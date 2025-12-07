import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TryOnCamera } from '@/components/tryon/TryOnCamera';
import { useLooks } from '@/contexts/LooksContext';
import { products } from '@/data/products';
import { Product } from '@/types/product';

export default function TryOnPage() {
  const navigate = useNavigate();
  const { addLook } = useLooks();
  const [selectedProduct] = useState<Product | undefined>(products[0]);

  const handleSaveLook = (lookData: { userPhoto: string; product: Product }) => {
    addLook(lookData.userPhoto, lookData.product);
    // Don't navigate automatically - let user continue or close manually
  };

  return (
    <TryOnCamera 
      selectedProduct={selectedProduct}
      onClose={() => navigate(-1)}
      onSave={handleSaveLook}
    />
  );
}