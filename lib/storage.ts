import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { getDb } from './firebase';
import { Post, Photo, Skill, mockPosts, mockPhotos, cvSkills } from './data';

// Helper to check client environment
const isClient = typeof window !== 'undefined';

// --- Firebase Firestore CRUD for Posts ---

export const fetchAllPosts = async (): Promise<Post[]> => {
  try {
    const db = getDb();
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl || undefined,
        createdAt: data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toISOString()
          : data.createdAt,
      };
    });
  } catch (error) {
    console.error('Failed to fetch posts from Firebase, falling back to mock:', error);
    return mockPosts;
  }
};

export const savePost = async (post: Omit<Post, 'id' | 'createdAt'>): Promise<Post> => {
  const db = getDb();
  // Strip undefined fields – Firestore rejects them
  const cleanPost = Object.fromEntries(
    Object.entries(post).filter(([, v]) => v !== undefined)
  );
  const docRef = await addDoc(collection(db, 'posts'), {
    ...cleanPost,
    createdAt: Timestamp.now(),
  });
  return {
    ...post,
    id: docRef.id,
    createdAt: new Date().toISOString(),
  };
};

export const deletePost = async (id: string): Promise<void> => {
  const db = getDb();
  await deleteDoc(doc(db, 'posts', id));
};

// --- Firebase Firestore CRUD for Photos ---

export const fetchAllPhotos = async (): Promise<Photo[]> => {
  try {
    const db = getDb();
    const q = query(collection(db, 'photos'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        url: data.url,
        title: data.title,
        description: data.description || undefined,
        createdAt: data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toISOString()
          : data.createdAt,
      };
    });
  } catch (error) {
    console.error('Failed to fetch photos from Firebase, falling back to mock:', error);
    return mockPhotos;
  }
};

export const savePhoto = async (photo: Omit<Photo, 'id' | 'createdAt'>): Promise<Photo> => {
  const db = getDb();
  const cleanPhoto = Object.fromEntries(
    Object.entries(photo).filter(([, v]) => v !== undefined)
  );
  const docRef = await addDoc(collection(db, 'photos'), {
    ...cleanPhoto,
    createdAt: Timestamp.now(),
  });
  return {
    ...photo,
    id: docRef.id,
    createdAt: new Date().toISOString(),
  };
};

export const savePhotos = async (newPhotos: Omit<Photo, 'id' | 'createdAt'>[]): Promise<Photo[]> => {
  const results: Photo[] = [];
  for (const photo of newPhotos) {
    const saved = await savePhoto(photo);
    results.push(saved);
  }
  return results;
};

export const deletePhoto = async (id: string): Promise<void> => {
  const db = getDb();
  await deleteDoc(doc(db, 'photos', id));
};

// --- Local Storage fallback for Skills ---

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

