'use client';

import Link from 'next/link';
import { Flame, Plus, BarChart3, ListChecks } from 'lucide-react';

interface Action {
  label: string;
  href: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const ACTIONS: Action[] = [
  { label: 'Track Habit',    href: '/dashboard/habits',    icon: <Flame size={20} />,      description: 'Check in on your habits',       color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40' },
  { label: 'Add Task',       href: '/dashboard/tasks',     icon: <Plus size={20} />,       description: 'Create a new task',             color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40' },
  { label: 'Routines',       href: '/dashboard/routines',  icon: <ListChecks size={20} />, description: 'View today\'s routines',        color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40' },
  { label: 'Analytics',      href: '/dashboard/analytics', icon: <BarChart3 size={20} />,  description: 'See your progress over time',   color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40' },
];

export function QuickActions() {
  return (
    <div className="card p-6">
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-colors text-center ${action.color}`}
          >
            <span className="text-current">{action.icon}</span>
            <span className="text-sm font-medium">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
