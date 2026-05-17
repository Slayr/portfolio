'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Projects', path: '/projects' },
  { name: 'Skills', path: '/skills' },
  { name: 'Experience', path: '/experience' },
  { name: 'Education', path: '/education' },
  { name: 'Photography', path: '/photography' },
  { name: 'Contact', path: '/contact' },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-8">
      {navItems.map((item) => {
        const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
        return (
          <Link
            key={item.name}
            href={item.path}
            className={`text-sm font-medium transition-colors ${
              isActive
                ? 'text-accent-orange'
                : 'text-ink/70 hover:text-ink'
            }`}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
