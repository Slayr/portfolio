import { useState, useEffect } from 'react';
import { Repo, mockRepos } from '@/lib/data';

export function useGithubRepos() {
  const [repos, setRepos] = useState<Repo[]>(mockRepos);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveGithubRepos = async () => {
      try {
        const res = await fetch('https://api.github.com/users/Slayr/repos?sort=updated&per_page=10');
        if (res.ok) {
          const data = await res.json();
          const filtered = data.filter((r: any) => !r.archived && !r.disabled).slice(0, 3);
          if (filtered.length > 0) {
            setRepos(filtered);
          }
        }
      } catch (error) {
        console.warn('Live repos fetch failed, using local mockRepos');
      } finally {
        setLoading(false);
      }
    };

    fetchLiveGithubRepos();
  }, []);

  return { repos, loading };
}
