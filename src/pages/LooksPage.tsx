import { Header } from '@/components/layout/Header';
import { SavedLooks } from '@/components/saved/SavedLooks';
import { useLooks } from '@/contexts/LooksContext';
import { toast } from 'sonner';

export default function LooksPage() {
  const { looks, removeLook } = useLooks();

  const handleDeleteLook = (id: string) => {
    removeLook(id);
    toast.success('Look dihapus');
  };

  return (
    <div className="pb-24">
      <Header />
      <div className="px-4 pt-4">
        <h1 className="text-2xl font-bold mb-2">My Looks</h1>
        <p className="text-muted-foreground text-sm mb-4">Hasil virtual try-on kamu</p>
      </div>
      <SavedLooks looks={looks} onDelete={handleDeleteLook} />
    </div>
  );
}