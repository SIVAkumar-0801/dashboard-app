'use client';

import { usePathname } from 'next/navigation';
import { format } from 'date-fns';
import { Sun, Moon, Menu, Bell } from 'lucide-react';
import { useTheme } from '@/app/theme-provider';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':           'Overview',
  '/dashboard/habits':    'Habits',
  '/dashboard/tasks':     'Tasks',
  '/dashboard/routines':  'Routines',
  '/dashboard/analytics': 'Analytics',
};

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const title = PAGE_TITLES[pathname] ?? 'Dashboard';

  return (
    <header className="sticky top-0 z-30 flex items-center h-16 px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shrink-0">
      {/* Mobile menu button */}
      <button
        className="lg:hidden mr-4 p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        onClick={onMenuToggle}
        aria-label="Toggle menu"
      >
        <Menu size={20} />
      </button>

      {/* Title */}
      <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h1>

      <div className="ml-auto flex items-center gap-3">
        {/* Date */}
        <span className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">
          {format(new Date(), 'EEE, MMM d')}
        </span>

        {/* Notification placeholder */}
        <button className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
          U
        </div>
      </div>
    </header>
  );
}
