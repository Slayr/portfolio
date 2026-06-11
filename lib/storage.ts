import { Post, Photo, Skill, mockPosts, mockPhotos, cvSkills } from './data';

// Helper to check client environment
const isClient = typeof window !== 'undefined';

export const fetchAllPosts = (): Post[] => {
  if (!isClient) return mockPosts;
  try {
    const localPostsStr = localStorage.getItem('portfolio_posts');
    if (!localPostsStr) {
      // Initialize if empty
      localStorage.setItem('portfolio_posts', JSON.stringify(mockPosts));
      return mockPosts;
    }
    return JSON.parse(localPostsStr);
  } catch (error) {
    console.error('Failed to fetch posts from localstorage:', error);
    return mockPosts;
  }
};

export const savePost = (post: Omit<Post, 'id' | 'createdAt'>): Post => {
  if (!isClient) {
    throw new Error('Can only save post on client side');
  }
  const all = fetchAllPosts();
  const newPost: Post = {
    ...post,
    id: Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toISOString(),
  };
  const updated = [newPost, ...all];
  localStorage.setItem('portfolio_posts', JSON.stringify(updated));
  return newPost;
};

export const deletePost = (id: string): void => {
  if (!isClient) return;
  const all = fetchAllPosts();
  const updated = all.filter(p => p.id !== id);
  localStorage.setItem('portfolio_posts', JSON.stringify(updated));
};

export const fetchAllPhotos = (): Photo[] => {
  if (!isClient) return mockPhotos;
  try {
    const localPhotosStr = localStorage.getItem('portfolio_photos');
    if (!localPhotosStr) {
      localStorage.setItem('portfolio_photos', JSON.stringify(mockPhotos));
      return mockPhotos;
    }
    return JSON.parse(localPhotosStr);
  } catch (error) {
    console.error('Failed to fetch photos from localstorage:', error);
    return mockPhotos;
  }
};

export const savePhoto = (photo: Omit<Photo, 'id' | 'createdAt'>): Photo => {
  if (!isClient) {
    throw new Error('Can only save photo on client side');
  }
  const all = fetchAllPhotos();
  const newPhoto: Photo = {
    ...photo,
    id: Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toISOString(),
  };
  const updated = [newPhoto, ...all];
  localStorage.setItem('portfolio_photos', JSON.stringify(updated));
  return newPhoto;
};

export const savePhotos = (newPhotos: Omit<Photo, 'id' | 'createdAt'>[]): Photo[] => {
  const results: Photo[] = [];
  for (const photo of newPhotos) {
    const saved = savePhoto(photo);
    results.push(saved);
  }
  return results;
};

export const deletePhoto = (id: string): void => {
  if (!isClient) return;
  const all = fetchAllPhotos();
  const updated = all.filter(p => p.id !== id);
  localStorage.setItem('portfolio_photos', JSON.stringify(updated));
};

export const fetchAllSkills = (): Skill[] => {
  if (!isClient) return cvSkills;
  try {
    const localSkillsStr = localStorage.getItem('portfolio_skills');
    if (!localSkillsStr) {
      localStorage.setItem('portfolio_skills', JSON.stringify(cvSkills));
      return cvSkills;
    }
    return JSON.parse(localSkillsStr);
  } catch (error) {
    console.error('Failed to fetch skills from localstorage:', error);
    return cvSkills;
  }
};

export const saveSkill = (skill: Skill): Skill => {
  if (!isClient) {
    throw new Error('Can only save skill on client side');
  }
  const all = fetchAllSkills();
  if (all.some(s => s.label.toLowerCase() === skill.label.toLowerCase())) {
    throw new Error('Skill already exists');
  }
  const updated = [...all, skill];
  localStorage.setItem('portfolio_skills', JSON.stringify(updated));
  return skill;
};

export const deleteSkill = (label: string): void => {
  if (!isClient) return;
  const all = fetchAllSkills();
  const updated = all.filter(s => s.label.toLowerCase() !== label.toLowerCase());
  localStorage.setItem('portfolio_skills', JSON.stringify(updated));
};
