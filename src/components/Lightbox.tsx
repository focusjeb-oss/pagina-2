import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Photo } from '../App';
import { ShoppingCart } from 'lucide-react';

interface LightboxProps {
  images: { src: string; title: string; description?: string }[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onGoTo: (index: number) => void;
  onAddToCart?: (photo: Photo) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
  onGoTo,
  onAddToCart,
}) => {
  // Navegación con teclado
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight') onNext();
    if (e.key === 'ArrowLeft') onPrev();
  }, [onClose, onNext, onPrev]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 text-white/80 hover:text-white transition-colors bg-white/10 rounded-full hover:bg-white/20"
      >
        <X size={32} />
      </button>

      {/* Contador de imágenes */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Botón anterior */}
      <button
        onClick={onPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white transition-colors bg-white/10 rounded-full hover:bg-white/20 disabled:opacity-30"
        disabled={currentIndex === 0}
      >
        <ChevronLeft size={40} />
      </button>

      {/* Imagen principal */}
      <div className="relative max-w-7xl max-h-[85vh] mx-4 flex flex-col items-center">
        <img
          src={currentImage.src}
          alt={currentImage.title}
          className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
        />

        <button
         onClick={() => 
          onAddToCart?.(images[currentIndex])}
         className="absolute bottom-30 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-navy text-oro shadow-lg hover:bg-navy/90 hover:scale-110 active:scale-95 transition-all duration-200"
         title="Agregar esta imagen al encargo"
      >
        <ShoppingCart size={22} />
        </button>
        
        
        {/* Info de la imagen */}
        <div className="mt-4 text-center text-white">
          <h3 className="text-xl font-semibold">{currentImage.title}</h3>
          {currentImage.description && (
            <p className="text-white/60 text-sm mt-1">{currentImage.description}</p>
          )}
        </div>
      </div>

      {/* Botón siguiente */}
      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white transition-colors bg-white/10 rounded-full hover:bg-white/20 disabled:opacity-30"
        disabled={currentIndex === images.length - 1}
      >
        <ChevronRight size={40} />
      </button>

      {/* Thumbnails de navegación */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto px-4 py-2 bg-black/50 rounded-full backdrop-blur-md">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => onGoTo(idx)}
            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
              idx === currentIndex ? 'border-cyan-400 opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
            }`}
          >
            <img src={img.src} alt={img.title} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Lightbox;
