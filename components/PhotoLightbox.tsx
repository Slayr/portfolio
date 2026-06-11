'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Photo } from '@/lib/data';

interface PhotoLightboxProps {
  photo: Photo | null;
  photos: Photo[];
  onClose: () => void;
  onNavigate: (photo: Photo) => void;
}

export function PhotoLightbox({ photo, photos, onClose, onNavigate }: PhotoLightboxProps) {
  const idx = photo ? photos.findIndex(p => p.id === photo.id) : -1;

  const handlePrev = () => {
    if (idx === -1 || photos.length === 0) return;
    const prevIdx = (idx - 1 + photos.length) % photos.length;
    onNavigate(photos[prevIdx]);
  };

  const handleNext = () => {
    if (idx === -1 || photos.length === 0) return;
    const nextIdx = (idx + 1) % photos.length;
    onNavigate(photos[nextIdx]);
  };

  // Keyboard navigation support
  useEffect(() => {
    if (!photo) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photo, idx]);

  if (!photo) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-8 select-none"
      >
        {/* Floating Close Button (Top Right) */}
        <button
          onClick={onClose}
          className="fixed top-6 right-6 p-3 bg-neo-pink text-white hover:bg-white hover:text-black border-3 border-line rounded-full shadow-[4px_4px_0px_0px_var(--line)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all z-[110] cursor-pointer"
          aria-label="Close viewer"
        >
          <X size={20} />
        </button>

        {/* Floating Left Arrow (Center Left) */}
        <button
          onClick={handlePrev}
          className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 p-4 bg-neutral-950 hover:bg-neo-yellow text-white hover:text-black border-3 border-line rounded-full shadow-[4px_4px_0px_0px_var(--line)] hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all z-[110] cursor-pointer"
          aria-label="Previous photo"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Side-by-Side Flex Layout Container */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-[85vw] max-h-[85vh] md:max-h-[75vh]">
          
          {/* Left Panel: Photo Frame */}
          <div className="relative flex items-center justify-center max-w-full md:max-w-[55vw]">
            <AnimatePresence mode="wait">
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="relative border-4 border-line rounded-xl shadow-[12px_12px_0px_0px_var(--line)] overflow-hidden bg-neutral-950"
              >
                {/* Subtle Scanline CRT Overlay */}
                <div className="absolute inset-0 bg-scanlines pointer-events-none opacity-5"></div>
                
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="max-w-[80vw] md:max-w-[55vw] max-h-[50vh] md:max-h-[70vh] w-auto h-auto object-contain block"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Panel: Metadata Sidebar */}
          <div className="w-full md:w-80 bg-neutral-950 text-white p-5 border-3 border-line rounded-xl shadow-[6px_6px_0px_0px_var(--line)] text-left flex flex-col justify-between shrink-0 gap-4">
            <div className="space-y-4">
              <div className="border-b border-neutral-850 pb-3">
                <span className="font-mono text-[9px] text-neo-cyan font-black uppercase tracking-wider block mb-1">
                  METADATA STREAM {" // "} EXP_0{idx + 1}
                </span>
                <span className="font-mono text-[10px] text-neutral-400">
                  IMAGE {idx + 1} OF {photos.length}
                </span>
              </div>
              
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight font-sans text-white leading-tight">
                  {photo.title}
                </h3>
                {photo.description && (
                  <p className="text-xs text-neutral-400 font-sans mt-2 leading-relaxed border-t border-neutral-900 pt-2">
                    {photo.description}
                  </p>
                )}
              </div>

              <div className="space-y-2 font-mono text-[10px] text-neutral-400 border-t border-neutral-850 pt-3">
                {photo.createdAt && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">DATE:</span>
                    <span>{new Date(photo.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-neutral-500">FORMAT:</span>
                  <span>STATIC_CAPTURE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">INDEX:</span>
                  <span>0{idx + 1}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-900 pt-4 flex flex-col gap-2 font-mono">
              <span className="text-[8px] text-neutral-600 uppercase tracking-tighter">
                NAVIGATE: [LEFT/RIGHT ARROWS]
              </span>
              <button 
                onClick={onClose}
                className="w-full py-2 px-4 border-2 border-line bg-neo-pink text-white rounded font-mono font-black text-[10px] uppercase tracking-wider shadow-[3px_3px_0px_0px_var(--line)] hover:bg-white hover:text-black active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <X size={12} /> CLOSE_VIEW
              </button>
            </div>
          </div>

        </div>

        {/* Floating Right Arrow (Center Right) */}
        <button
          onClick={handleNext}
          className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 p-4 bg-neutral-950 hover:bg-neo-yellow text-white hover:text-black border-3 border-line rounded-full shadow-[4px_4px_0px_0px_var(--line)] hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all z-[110] cursor-pointer"
          aria-label="Next photo"
        >
          <ChevronRight size={24} />
        </button>

      </motion.div>
    </AnimatePresence>
  );
}
