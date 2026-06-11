'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { Post, JOURNAL_CARD_COLORS } from '@/lib/data';
import { fetchAllPosts } from '@/lib/storage';
import { PostDetailsModal } from '@/components/PostDetailsModal';

export default function JournalPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    Promise.resolve().then(async () => {
      const postsData = await fetchAllPosts();
      setPosts(postsData);
    });
  }, []);

  return (
    <div className="space-y-10 min-h-screen pb-12">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-4 border-line p-6 bg-glass shadow-[8px_8px_0px_0px_var(--line)] rounded-xl">
        <div className="flex items-center gap-3">
          <BookOpen size={32} className="text-neo-pink animate-pulse" />
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight font-sans text-ink">
              JOURNAL DISPATCHES
            </h1>
            <p className="font-mono text-xs opacity-75 uppercase tracking-wide">
              SYSTEM_LOG_TRANSMISSIONS // ALL RECORDS
            </p>
          </div>
        </div>
        <Link 
          href="/" 
          className="self-start sm:self-auto font-mono text-xs font-black uppercase bg-neo-yellow text-black hover:bg-black hover:text-neo-yellow px-4 py-2.5 border-3 border-line rounded shadow-[4px_4px_0px_0px_var(--line)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center gap-2"
        >
          <ArrowLeft size={14} /> BACK_TO_DASHBOARD
        </Link>
      </div>

      {/* Grid of Journal Entries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, idx) => {
          const colorClass = JOURNAL_CARD_COLORS[idx % JOURNAL_CARD_COLORS.length];
          const rotation = idx % 2 === 0 ? 'rotate-[-1deg] hover:rotate-[1deg]' : 'rotate-[1.5deg] hover:rotate-[-1deg]';
          return (
            <div
              key={`post-${post.id}`}
              onClick={() => setSelectedPost(post)}
              className={`te-card p-6 border-3 border-line shadow-[6px_6px_0px_0px_var(--line)] hover:-translate-y-1.5 hover:shadow-[8px_8px_0px_0px_var(--line)] transition-all cursor-pointer rounded-xl flex flex-col justify-between min-h-[250px] ${colorClass} ${rotation}`}
            >
              <div>
                <div className="flex justify-between items-center pb-2 border-b border-white/20">
                  <span className="font-mono text-[10px] font-black bg-black text-white px-2.5 py-0.5 rounded border border-line shadow-[1.5px_1.5px_0px_0px_#fff]">
                    LOG_0{idx + 1}
                  </span>
                  <span className="font-mono text-[9px] font-bold opacity-80">
                    {post.createdAt ? format(new Date(post.createdAt), 'yyyy-MM-dd') : 'UNKNOWN'}
                  </span>
                </div>
                <h3 className="font-sans font-black text-lg leading-snug uppercase mt-4 line-clamp-2">
                  {post.title}
                </h3>
                <p className="font-sans text-xs opacity-90 line-clamp-4 mt-3 leading-relaxed">
                  {post.content}
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-white/20 flex justify-between items-center">
                <span className="font-mono text-[10px] font-black tracking-widest uppercase">
                  DECRYPT & READ LOG →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {posts.length === 0 && (
        <div className="border-4 border-dashed border-neutral-400 p-12 text-center rounded-xl bg-glass">
          <p className="font-mono text-sm text-neutral-500 uppercase tracking-widest">
            ERROR: NO LOGS DETECTED ON STATION CHANNELS.
          </p>
        </div>
      )}

      {/* Modal Detailed Reading View */}
      <PostDetailsModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </div>
  );
}
