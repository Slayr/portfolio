'use client';

import { Github } from 'lucide-react';
import { Repo } from '@/lib/data';

interface ProjectsWidgetProps {
  repos: Repo[];
  onSelectRepo: (repo: Repo) => void;
}

function getLanguagesForRepo(repo: Repo): string[] {
  const langs = new Set<string>();
  if (repo.language) {
    langs.add(repo.language);
  }
  
  const knownMappings: Record<string, string[]> = {
    'autonomous-drone-nav': ['Python', 'C++', 'ROS', 'PyTorch'],
    'stratbeans-api': ['TypeScript', 'Express', 'PostgreSQL', 'PHP', 'Laravel'],
    'bio-stat-predictor': ['Jupyter Notebook', 'Python', 'R', 'scikit-learn'],
    'portfolio': ['TypeScript', 'React', 'Next.js', 'TailwindCSS'],
  };

  const nameLower = repo.name.toLowerCase();
  if (knownMappings[nameLower]) {
    return knownMappings[nameLower];
  }

  const text = `${repo.name} ${repo.description || ''}`.toLowerCase();
  if (text.includes('python') || text.includes('pytorch') || text.includes('django') || text.includes('flask')) langs.add('Python');
  if (text.includes('typescript') || text.includes('next.js') || text.includes('ts')) langs.add('TypeScript');
  if (text.includes('javascript') || text.includes('react') || text.includes('node') || text.includes('js')) langs.add('JavaScript');
  if (text.includes('laravel') || text.includes('php')) { langs.add('PHP'); langs.add('Laravel'); }
  if (text.includes('c++') || text.includes('cpp')) langs.add('C++');
  if (text.includes('sql') || text.includes('postgres') || text.includes('mysql')) langs.add('SQL');
  if (text.includes('ros') || text.includes('drone') || text.includes('quadcopter')) langs.add('ROS');

  return Array.from(langs);
}

export function ProjectsWidget({ repos, onSelectRepo }: ProjectsWidgetProps) {
  return (
    <div id="projects-widget" className="md:col-span-4 te-card p-6 bg-glass text-ink flex flex-col justify-between relative border-4 border-line shadow-[8px_8px_0px_0px_var(--line)]">
      <div className="flex items-center justify-between border-b-3 border-line pb-4 mb-6">
        <h2 className="text-2xl font-black tracking-tight uppercase flex items-center gap-2">
          <Github size={28} className="text-neo-pink animate-spin-slow" />
          LATEST CODEBASE & REPOSITORIES
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {repos.map((repo) => (
          <div 
            key={repo.id}
            onClick={() => onSelectRepo(repo)}
            className="p-5 border-3 border-line bg-bg hover:bg-neo-yellow hover:text-black hover:-translate-x-1.5 hover:-translate-y-1.5 hover:shadow-[4px_4px_0px_0px_var(--line)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all duration-150 cursor-pointer rounded-lg flex flex-col justify-between h-48"
          >
            <div className="space-y-2">
              <h3 className="font-sans font-black text-base uppercase truncate">{repo.name}</h3>
              <p className="text-xs opacity-80 leading-normal line-clamp-3">
                {repo.description || 'No description available.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-1 mt-4 border-t border-line/20 pt-3">
              {getLanguagesForRepo(repo).map((lang) => (
                <span key={lang} className="te-pill py-0.5 px-1.5 text-[8px] font-black bg-black text-white border-line shadow-none">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export { getLanguagesForRepo };
