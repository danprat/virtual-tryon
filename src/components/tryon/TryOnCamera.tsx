import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, RotateCcw, Sparkles, Share2, Download, Instagram, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

interface TryOnCameraProps {
  selectedProduct?: Product;
  onClose: () => void;
  onSave: (lookData: { userPhoto: string; product: Product }) => void;
}

export function TryOnCamera({ selectedProduct, onClose, onSave }: TryOnCameraProps) {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [resultPhoto, setResultPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [showResult, setShowResult] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setUserPhoto(base64);
        if (selectedProduct) {
          processVirtualTryOn(base64);
        } else {
          toast.info('Pilih produk terlebih dahulu untuk mencoba virtual try-on');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      console.log('Starting camera...');
      setIsCameraActive(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 960 } } 
      });
      streamRef.current = stream;
      
      // Wait for next render cycle to ensure video element exists
      setTimeout(async () => {
        if (videoRef.current && streamRef.current) {
          videoRef.current.srcObject = streamRef.current;
          try {
            await videoRef.current.play();
            console.log('Camera ready and playing');
            setIsCameraReady(true);
            toast.success('Kamera aktif! Posisikan diri dalam frame.');
          } catch (playError) {
            console.error('Video play error:', playError);
            toast.error('Gagal memulai kamera. Coba lagi.');
            stopCamera();
          }
        }
      }, 100);
    } catch (error) {
      console.error('Camera error:', error);
      setIsCameraActive(false);
      toast.error('Tidak bisa mengakses kamera. Pastikan izin kamera sudah diberikan.');
    }
  };

  const capturePhoto = () => {
    console.log('Capturing photo...');
    if (videoRef.current && isCameraReady) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 720;
      canvas.height = videoRef.current.videoHeight || 960;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const base64 = canvas.toDataURL('image/jpeg', 0.9);
        console.log('Photo captured, base64 length:', base64.length);
        setUserPhoto(base64);
        stopCamera();
        if (selectedProduct) {
          processVirtualTryOn(base64);
        } else {
          toast.info('Pilih produk terlebih dahulu untuk mencoba virtual try-on');
        }
      }
    } else {
      toast.error('Kamera belum siap. Tunggu sebentar...');
    }
  };

  const stopCamera = () => {
    console.log('Stopping camera...');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsCameraReady(false);
  };

  const fetchProductImageAsBase64 = async (imageUrl: string): Promise<string> => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error fetching product image:', error);
      throw error;
    }
  };

  const processVirtualTryOn = async (photoBase64: string) => {
    if (!selectedProduct) {
      toast.error('Pilih produk terlebih dahulu');
      return;
    }

    setIsProcessing(true);
    setProcessingStatus('Mengunduh gambar produk...');

    try {
      const productImageBase64 = await fetchProductImageAsBase64(selectedProduct.image);
      
      setProcessingStatus('AI sedang memproses virtual try-on...');
      
      const response = await fetch(`${API_URL}/api/virtual-tryon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPhotoBase64: photoBase64,
          productImage: productImageBase64,
          productName: selectedProduct.name,
          productCategory: selectedProduct.category,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Virtual try-on response:', data);

      if (data.success && data.generatedImage) {
        setResultPhoto(data.generatedImage);
        setShowResult(true);
        toast.success('✨ Virtual try-on berhasil! Klik "Simpan Look Ini" untuk menyimpan.');
      } else {
        setResultPhoto(photoBase64);
        setShowResult(true);
        toast.info(data.message || 'Menampilkan preview. Coba lagi dengan foto yang lebih jelas.');
      }
    } catch (error) {
      console.error('Virtual try-on error:', error);
      toast.error('Gagal memproses virtual try-on. Coba lagi.');
      setResultPhoto(photoBase64);
      setShowResult(true);
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  const handleReset = () => {
    setUserPhoto(null);
    setResultPhoto(null);
    setShowResult(false);
    stopCamera();
  };

  const handleSave = () => {
    if ((resultPhoto || userPhoto) && selectedProduct) {
      onSave({ userPhoto: resultPhoto || userPhoto!, product: selectedProduct });
      toast.success('Look tersimpan! 💖');
    }
  };

  const handleShareInstagram = async () => {
    if (resultPhoto || userPhoto) {
      if (navigator.share && navigator.canShare) {
        try {
          const blob = await fetch(resultPhoto || userPhoto!).then(r => r.blob());
          const file = new File([blob], 'tryon-look.jpg', { type: 'image/jpeg' });
          
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: `Virtual Try-On - ${selectedProduct?.name}`,
              text: `Lagi coba ${selectedProduct?.name} pakai virtual try-on! 🔥 #VirtualTryOn #Fashion #OOTD`,
            });
            toast.success('Berhasil dibagikan! 🎉');
            return;
          }
        } catch (error) {
          console.log('Share cancelled or failed:', error);
        }
      }
      
      toast.info('Simpan gambar dan upload ke Instagram Stories! 📱', {
        description: 'Gunakan hashtag: #VirtualTryOn #Fashion #OOTD'
      });
    }
  };

  const handleDownload = () => {
    if (resultPhoto || userPhoto) {
      const link = document.createElement('a');
      link.href = resultPhoto || userPhoto!;
      link.download = `tryon-${selectedProduct?.name || 'look'}-${Date.now()}.jpg`;
      link.click();
      toast.success('Gambar tersimpan! 📥');
    }
  };

  // Render camera view separately when active (on top of everything)
  if (isCameraActive) {
    return (
      <div className="fixed inset-0 z-[200] bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
        />
        
        {/* Camera guide overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-72 h-96 border-2 border-white/50 rounded-3xl">
              <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
              <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
              <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
            </div>
          </div>
          
          <div className="absolute top-20 left-0 right-0 text-center">
            <p className="text-white text-lg font-semibold drop-shadow-lg">
              Posisikan wajah & tubuh dalam frame
            </p>
            <p className="text-white/70 text-sm mt-1">
              {isCameraReady ? 'Tekan tombol putih untuk foto' : 'Memuat kamera...'}
            </p>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 pb-12 pt-6 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center justify-center gap-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={stopCamera}
              className="w-14 h-14 rounded-full bg-white/20 text-white hover:bg-white/30"
            >
              <X className="w-7 h-7" />
            </Button>
            
            <button
              onClick={capturePhoto}
              disabled={!isCameraReady}
              className={cn(
                "w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg transition-all",
                isCameraReady ? "active:scale-95" : "opacity-50"
              )}
            >
              <div className="w-16 h-16 rounded-full border-4 border-primary bg-white" />
            </button>
            
            <div className="w-14 h-14" />
          </div>
          
          {selectedProduct && (
            <div className="mt-4 mx-auto w-fit px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              <p className="text-white text-sm font-medium">
                📸 {selectedProduct.name}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 safe-top">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-6 h-6" />
        </Button>
        <h2 className="font-bold text-lg">Virtual Try-On AI</h2>
        <div className="w-10" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-hidden">
        {!userPhoto && !showResult ? (
          // Initial State - Choose Upload or Camera
          <div className="w-full max-w-sm space-y-6 animate-scale-in">
            <div className="text-center mb-8">
              <div className="w-24 h-24 mx-auto bg-gradient-hero rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Virtual Try-On</h3>
              <p className="text-muted-foreground text-sm">
                Upload foto atau ambil selfie, AI akan menampilkan kamu memakai outfit pilihan! ✨
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={startCamera}
                className="w-full h-14 text-base"
              >
                <Camera className="w-5 h-5 mr-2" />
                Ambil Selfie
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-14 text-base"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Foto
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
              />
            </div>

            {selectedProduct && (
              <div className="mt-6 p-4 bg-gradient-card rounded-2xl border border-border">
                <p className="text-xs text-muted-foreground mb-2">Produk yang akan dicoba:</p>
                <div className="flex items-center gap-3">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div>
                    <p className="font-semibold text-sm">{selectedProduct.name}</p>
                    <p className="text-primary text-sm font-bold">
                      Rp {selectedProduct.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!selectedProduct && (
              <div className="mt-6 p-4 bg-accent/50 rounded-2xl border border-border text-center">
                <p className="text-sm text-muted-foreground">
                  💡 Tip: Pilih produk dari katalog terlebih dahulu untuk hasil terbaik!
                </p>
              </div>
            )}
          </div>
        ) : isProcessing ? (
          // Processing State
          <div className="text-center animate-pulse-soft">
            <div className="w-32 h-32 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-6 relative">
              <Loader2 className="w-16 h-16 text-primary-foreground animate-spin" />
              <div className="absolute inset-0 rounded-full border-4 border-primary-foreground/20 animate-ping" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI sedang bekerja...</h3>
            <p className="text-muted-foreground text-sm">{processingStatus || 'Menyesuaikan outfit untukmu ✨'}</p>
            <p className="text-xs text-muted-foreground mt-4">Ini mungkin memakan waktu 10-30 detik</p>
          </div>
        ) : showResult ? (
          // Result State
          <div className="w-full max-w-sm space-y-4 animate-slide-up">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-card">
              <img
                src={resultPhoto || userPhoto!}
                alt="Try-on result"
                className="w-full h-full object-cover"
              />
              
              {/* Product info overlay */}
              {selectedProduct && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/80 to-transparent">
                  <div className="glass rounded-2xl p-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={selectedProduct.image} 
                        alt={selectedProduct.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-primary-foreground">{selectedProduct.name}</p>
                        <p className="text-primary text-xs font-bold">
                          Rp {selectedProduct.price.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-gradient-primary text-primary-foreground text-xs font-bold rounded-full shadow-button flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI Generated
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-4 gap-2">
              <Button variant="glass" size="icon" onClick={handleReset} title="Coba lagi">
                <RotateCcw className="w-5 h-5" />
              </Button>
              <Button variant="glass" size="icon" onClick={handleDownload} title="Download">
                <Download className="w-5 h-5" />
              </Button>
              <Button variant="glass" size="icon" title="Share">
                <Share2 className="w-5 h-5" />
              </Button>
              <Button 
                size="icon" 
                onClick={handleShareInstagram}
                className="bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737]"
                title="Share to Instagram"
              >
                <Instagram className="w-5 h-5" />
              </Button>
            </div>

            <Button className="w-full" onClick={handleSave}>
              💖 Simpan Look Ini
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}