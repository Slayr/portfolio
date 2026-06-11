'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    Promise.resolve().then(() => {
      setMounted(true);
    });
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 border-2 border-line bg-neo-cyan text-black rounded-md shadow-[2px_2px_0px_0px_var(--line)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--line)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all duration-100 cursor-pointer"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={18} className="text-black" /> : <Moon size={18} className="text-black" />}
    </button>
  );
}
