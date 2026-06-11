'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Camera, ArrowLeft } from 'lucide-react';
import { Photo, PHOTO_STAMP_COLORS, PHOTO_CARD_COLORS } from '@/lib/data';
import { fetchAllPhotos } from '@/lib/storage';
import { PhotoLightbox } from '@/components/PhotoLightbox';

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    Promise.resolve().then(() => {
      setPhotos(fetchAllPhotos());
    });
  }, []);

  return (
    <div className="space-y-10 min-h-screen pb-12">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-4 border-black p-6 bg-glass shadow-[8px_8px_0px_0px_#000] rounded-xl">
        <div className="flex items-center gap-3">
          <Camera size={32} className="text-neo-pink animate-pulse" />
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight font-sans text-ink">
              OPTICAL ARCHIVES
            </h1>
            <p className="font-mono text-xs opacity-75 uppercase tracking-wide">
              IMAGE_STREAM_INTEGRITY // STATIC CAPTURES
            </p>
          </div>
        </div>
        <Link 
          href="/" 
          className="self-start sm:self-auto font-mono text-xs font-black uppercase bg-neo-yellow text-black hover:bg-black hover:text-neo-yellow px-4 py-2.5 border-3 border-black rounded shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center gap-2"
        >
          <ArrowLeft size={14} /> BACK_TO_DASHBOARD
        </Link>
      </div>

      {/* Masonry Bento Grid conforming to aspect ratio */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
        {photos.map((photo, idx) => {
          const stampColor = PHOTO_STAMP_COLORS[idx % PHOTO_STAMP_COLORS.length];
          const cardColor = PHOTO_CARD_COLORS[idx % PHOTO_CARD_COLORS.length];
          const rotation = idx % 2 === 0 ? 'rotate-[1deg] hover:rotate-[-1deg]' : 'rotate-[-1.5deg] hover:rotate-[1deg]';
          return (
            <div
              key={`photo-${photo.id}`}
              onClick={() => setSelectedPhoto(photo)}
              className={`w-full p-3 border-3 border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] transition-all cursor-pointer rounded-sm ${cardColor} ${rotation}`}
            >
              <div className="relative w-full overflow-hidden border-2 border-black bg-neutral-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={photo.url} 
                  alt={photo.title} 
                  className="w-full h-auto object-cover animate-fade-in block" 
                />
              </div>
              <div className="pt-3 flex flex-col justify-between items-start space-y-1 select-none">
                <div className="flex justify-between items-center w-full">
                  <h4 className="font-sans font-black text-sm uppercase truncate max-w-[70%]">{photo.title}</h4>
                  <span className={`font-mono text-[8px] font-black border-2 px-1.5 py-0.5 rounded ${stampColor} shadow-[1px_1px_0px_0px_#000]`}>
                    EXP_0{idx + 1}
                  </span>
                </div>
                <span className="font-mono text-[8px] font-bold opacity-85">DATE: {new Date(photo.createdAt).toLocaleDateString()}</span>
                {photo.description && (
                  <p className="font-sans text-[10px] opacity-75 mt-1 border-t border-black/10 pt-1 w-full italic truncate">
                    {photo.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {photos.length === 0 && (
        <div className="border-4 border-dashed border-neutral-400 p-12 text-center rounded-xl bg-glass">
          <p className="font-mono text-sm text-neutral-500 uppercase tracking-widest">
            ERROR: NO OPTICAL CAPTURES DEPLOYED IN ARCHIVES.
          </p>
        </div>
      )}

      {/* Fullscreen Lightbox Display */}
      <PhotoLightbox 
        photo={selectedPhoto} 
        photos={photos} 
        onClose={() => setSelectedPhoto(null)} 
        onNavigate={setSelectedPhoto} 
      />
    </div>
  );
}
