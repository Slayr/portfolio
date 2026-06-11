'use client';

import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import { Post, JOURNAL_CARD_COLORS } from '@/lib/data';

interface JournalFeedWidgetProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
}

export function JournalFeedWidget({ posts, onSelectPost }: JournalFeedWidgetProps) {
  // Sort posts by date descending
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
  );

  return (
    <div id="journal-feed-widget" className="md:col-span-4 te-card p-6 bg-glass border-4 border-line text-ink flex flex-col justify-between relative shadow-[8px_8px_0px_0px_var(--line)] overflow-hidden">
      <div className="flex items-center justify-between border-b-3 border-line pb-4 mb-6 gap-2">
        <h2 className="text-sm sm:text-lg md:text-2xl font-black uppercase tracking-tight flex items-center gap-2 min-w-0">
          <BookOpen size={20} className="text-neo-pink animate-pulse shrink-0" />
          <span className="truncate">JOURNAL DISPATCHES</span>
        </h2>
        <div className="flex items-center gap-2 shrink-0">
          <Link 
            href="/journal" 
            className="font-mono text-[9px] md:text-xs font-black uppercase bg-neo-pink text-white hover:bg-black hover:text-neo-pink px-2.5 py-1.5 border-2 border-line rounded shadow-[2px_2px_0px_0px_var(--line)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            VIEW ALL →
          </Link>
          <span className="font-mono text-[9px] font-black uppercase bg-black text-white px-2.5 py-1 border border-line rounded shadow-[2px_2px_0px_0px_var(--neo-pink)] hidden sm:inline-block">
            LOGS_ACTIVE
          </span>
        </div>
      </div>
      
      <div className="flex overflow-x-auto gap-6 pb-6 snap-x scrollbar-thin scrollbar-thumb-neo-pink scrollbar-track-transparent">
        {sortedPosts.map((post, idx) => {
          const colorClass = JOURNAL_CARD_COLORS[idx % JOURNAL_CARD_COLORS.length];
          const rotation = idx % 2 === 0 ? 'rotate-[-1deg] hover:rotate-[1deg]' : 'rotate-[1.5deg] hover:rotate-[-1deg]';
          return (
            <div
              key={`post-${post.id}`}
              onClick={() => onSelectPost(post)}
              className={`snap-align-start shrink-0 w-80 p-5 border-3 border-line shadow-[4px_4px_0px_0px_var(--line)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--line)] transition-all cursor-pointer rounded-md flex flex-col justify-between ${colorClass} ${rotation}`}
            >
              <div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[9px] font-black bg-black text-white px-2 py-0.5 rounded border border-line shadow-[1px_1px_0px_0px_#fff]">
                    LOG_0{idx + 1}
                  </span>
                  <span className="font-mono text-[8px] font-bold opacity-80">
                    {post.createdAt ? format(new Date(post.createdAt), 'yyyy-MM-dd') : ''}
                  </span>
                </div>
                <h3 className="font-sans font-black text-md leading-snug uppercase mt-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="font-sans text-[11px] opacity-90 line-clamp-3 mt-2">
                  {post.content}
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-white/20 flex justify-between items-center">
                <span className="font-mono text-[9px] font-black tracking-widest uppercase">READ FULL LOG →</span>
              </div>
            </div>
          );
        })}
        {sortedPosts.length === 0 && (
          <div className="w-full py-8 text-center text-xs font-mono text-neutral-500">
            No journal dispatches available.
          </div>
        )}
      </div>
    </div>
  );
}
