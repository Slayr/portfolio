'use client';

import Link from 'next/link';
import { Camera } from 'lucide-react';
import { Photo, PHOTO_STAMP_COLORS, PHOTO_CARD_COLORS } from '@/lib/data';

interface PhotoFeedWidgetProps {
  photos: Photo[];
  onSelectPhoto: (photo: Photo) => void;
}

export function PhotoFeedWidget({ photos, onSelectPhoto }: PhotoFeedWidgetProps) {
  // Sort photos by date descending
  const sortedPhotos = [...photos].sort(
    (a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
  );

  return (
    <div id="photo-feed-widget" className="md:col-span-4 te-card p-6 bg-glass border-4 border-black text-ink flex flex-col justify-between relative shadow-[8px_8px_0px_0px_#000] overflow-hidden">
      <div className="flex items-center justify-between border-b-3 border-black pb-4 mb-6 gap-2">
        <h2 className="text-sm sm:text-lg md:text-2xl font-black uppercase tracking-tight flex items-center gap-2 min-w-0">
          <Camera size={20} className="text-neo-pink animate-pulse shrink-0" />
          <span className="truncate">OPTICAL ARCHIVES</span>
        </h2>
        <div className="flex items-center gap-2 shrink-0">
          <Link 
            href="/photos" 
            className="font-mono text-[9px] md:text-xs font-black uppercase bg-neo-cyan text-black hover:bg-black hover:text-neo-cyan px-2.5 py-1.5 border-2 border-black rounded shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            VIEW ALL →
          </Link>
          <span className="font-mono text-[9px] font-black uppercase bg-black text-white px-2.5 py-1 border border-black rounded shadow-[2px_2px_0px_0px_var(--neo-pink)] hidden sm:inline-block">
            ARCHIVES_ACTIVE
          </span>
        </div>
      </div>
      
      <div className="flex overflow-x-auto gap-6 pb-6 snap-x scrollbar-thin scrollbar-thumb-neo-pink scrollbar-track-transparent">
        {sortedPhotos.map((photo, idx) => {
          const stampColor = PHOTO_STAMP_COLORS[idx % PHOTO_STAMP_COLORS.length];
          const cardColor = PHOTO_CARD_COLORS[idx % PHOTO_CARD_COLORS.length];
          const rotation = idx % 2 === 0 ? 'rotate-[1deg] hover:rotate-[-1deg]' : 'rotate-[-1.5deg] hover:rotate-[1deg]';
          return (
            <div
              key={`photo-${photo.id}`}
              onClick={() => onSelectPhoto(photo)}
              className={`snap-align-start shrink-0 w-64 p-3 border-3 border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] transition-all cursor-pointer rounded-sm ${cardColor} ${rotation}`}
            >
              <div className="relative h-44 w-full overflow-hidden border-2 border-black bg-neutral-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt={photo.title} className="w-full h-full object-cover animate-fade-in" />
              </div>
              <div className="pt-3 flex flex-col justify-between items-start space-y-1 select-none">
                <div className="flex justify-between items-center w-full">
                  <h4 className="font-sans font-black text-sm uppercase truncate max-w-[70%]">{photo.title}</h4>
                  <span className={`font-mono text-[8px] font-black border-2 px-1.5 py-0.5 rounded ${stampColor} shadow-[1px_1px_0px_0px_#000]`}>
                    EXP_0{idx + 1}
                  </span>
                </div>
                <span className="font-mono text-[8px] font-bold opacity-85">DATE: {new Date(photo.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          );
        })}
        {sortedPhotos.length === 0 && (
          <div className="w-full py-8 text-center text-xs font-mono text-neutral-500">
            No optical archives available.
          </div>
        )}
      </div>
    </div>
  );
}
