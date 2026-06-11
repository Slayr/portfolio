'use client';

import { useState, useEffect } from 'react';
import { Repo, Photo, Post, Skill } from '@/lib/data';
import { fetchAllPosts, fetchAllPhotos, fetchAllSkills } from '@/lib/storage';
import { useGithubRepos } from '@/hooks/useGithubRepos';

// Modular Widgets
import { ProfileWidget } from '@/components/ProfileWidget';
import { SkillsWidget } from '@/components/SkillsWidget';
import { ExperienceWidget } from '@/components/ExperienceWidget';
import { EducationWidget } from '@/components/EducationWidget';
import { ProjectsWidget } from '@/components/ProjectsWidget';
import { JournalFeedWidget } from '@/components/JournalFeedWidget';
import { PhotoFeedWidget } from '@/components/PhotoFeedWidget';
import { CliTerminalWidget } from '@/components/CliTerminalWidget';

// Modular Modals & Lightbox
import { RepoDetailsModal } from '@/components/RepoDetailsModal';
import { PostDetailsModal } from '@/components/PostDetailsModal';
import { PhotoLightbox } from '@/components/PhotoLightbox';

export default function Home() {
  // States loaded from client-local database layer (storage.ts)
  const [posts, setPosts] = useState<Post[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  // Selected asset preview states
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // Skills highlight query state
  const [skillQuery, setSkillQuery] = useState('');

  // Fetch GitHub repos using modular custom hook
  const { repos } = useGithubRepos();

  // Load local posts and photos on mount (client-side only to avoid SSR mismatches)
  useEffect(() => {
    Promise.resolve().then(() => {
      setPosts(fetchAllPosts());
      setPhotos(fetchAllPhotos());
      setSkills(fetchAllSkills());
    });
  }, []);

  return (
    <div className="space-y-12">
      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* WIDGET 1: Profile Block (4x) - contains the hidden 5-clicks login trigger */}
        <ProfileWidget />

        {/* WIDGET 2: Skills Arena (2x) */}
        <SkillsWidget skills={skills} skillQuery={skillQuery} setSkillQuery={setSkillQuery} />

        {/* WIDGET 4: Academic Credentials (2x) */}
        <EducationWidget />

        {/* WIDGET 3: Professional Timeline (4x) */}
        <ExperienceWidget />

        {/* WIDGET 5: Projects Widget (4x2) */}
        <ProjectsWidget repos={repos} onSelectRepo={setSelectedRepo} />

        {/* WIDGET 6a: Journal Feed Widget (4x1) */}
        <JournalFeedWidget 
          posts={posts} 
          onSelectPost={setSelectedPost} 
        />

        {/* WIDGET 6b: Photo Feed Widget (4x1) */}
        <PhotoFeedWidget 
          photos={photos} 
          onSelectPhoto={setSelectedPhoto} 
        />

        {/* WIDGET 7: CLI Terminal Message Port (4x2) */}
        <CliTerminalWidget />

      </div>

      {/* MODALS & FULLSCREEN LIGHTBOX PREVIEWS */}
      <RepoDetailsModal repo={selectedRepo} onClose={() => setSelectedRepo(null)} />
      <PostDetailsModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      <PhotoLightbox 
        photo={selectedPhoto} 
        photos={photos} 
        onClose={() => setSelectedPhoto(null)} 
        onNavigate={setSelectedPhoto} 
      />
    </div>
  );
}
