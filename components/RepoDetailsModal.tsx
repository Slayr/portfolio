'use client';

import { ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Repo } from '@/lib/data';
import { Modal } from '@/components/ui/Modal';
import { getLanguagesForRepo } from './ProjectsWidget';

interface RepoDetailsModalProps {
  repo: Repo | null;
  onClose: () => void;
}

export function RepoDetailsModal({ repo, onClose }: RepoDetailsModalProps) {
  return (
    <Modal
      isOpen={!!repo}
      onClose={onClose}
      title={repo?.name || 'Project Details'}
    >
      {repo && (
        <div className="space-y-6 text-black dark:text-white">
          <p className="text-lg font-bold">{repo.description || 'No description provided.'}</p>
          <div className="flex flex-wrap gap-2">
            {getLanguagesForRepo(repo).map((lang) => (
              <span key={lang} className="te-pill bg-black text-white border-black">
                {lang}
              </span>
            ))}
            <span className="te-pill bg-white text-black border-black">
              Updated: {format(new Date(repo.updated_at), 'MMM dd, yyyy')}
            </span>
          </div>
          <div className="pt-6 border-t-4 border-dashed border-black/20 dark:border-white/20">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="te-button te-button-accent inline-flex items-center gap-2"
            >
              View on GitHub <ArrowRight size={16} />
            </a>
          </div>
        </div>
      )}
    </Modal>
  );
}
