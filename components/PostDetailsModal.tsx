'use client';

import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { Post } from '@/lib/data';
import { Modal } from '@/components/ui/Modal';
import { extractDataImages, createImgRenderer } from '@/lib/markdown';

interface PostDetailsModalProps {
  post: Post | null;
  onClose: () => void;
}

export function PostDetailsModal({ post, onClose }: PostDetailsModalProps) {
  return (
    <Modal
      isOpen={!!post}
      onClose={onClose}
      title={post?.title || 'Blog Post'}
    >
      {post && (
        <div className="space-y-6 text-black dark:text-white">
          <div className="te-label pb-4 border-b-2 border-dashed border-black/20 dark:border-white/20">
            Published: {post.createdAt ? format(new Date(post.createdAt), 'MMM dd, yyyy') : 'Unknown'}
          </div>
          {(() => {
            const { processed, images } = extractDataImages(post.content);
            return (
              <div className="prose prose-neutral max-w-none font-sans prose-img:rounded-xl prose-img:w-full prose-headings:font-black prose-headings:uppercase prose-a:text-neo-pink dark:prose-invert">
                <ReactMarkdown components={{ img: createImgRenderer(images) }}>{processed}</ReactMarkdown>
              </div>
            );
          })()}
        </div>
      )}
    </Modal>
  );
}
