'use client';

import * as React from 'react';
import { Moon, Sun, Sparkles } from 'lucide-react';
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

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('colorful');
    } else {
      setTheme('light');
    }
  };

  const getButtonClass = () => {
    if (theme === 'light') {
      return 'bg-neo-yellow text-black';
    }
    if (theme === 'dark') {
      return 'bg-neo-purple text-white';
    }
    return 'bg-neo-pink text-white';
  };

  return (
    <button
      onClick={cycleTheme}
      className={`p-2 border-2 border-line rounded-md shadow-[2px_2px_0px_0px_var(--line)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--line)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all duration-100 cursor-pointer ${getButtonClass()}`}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Sun size={18} className="text-black" />
      ) : theme === 'dark' ? (
        <Moon size={18} className="text-white" />
      ) : (
        <Sparkles size={18} className="text-white animate-pulse" />
      )}
    </button>
  );
}
