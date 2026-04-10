'use client';

import { clsx } from 'clsx';
import { Flame, CheckCircle2, Circle, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { getCategoryColor, getCategoryLabel } from '@/lib/utils/helpers';
import type { HabitWithStats } from '@/types';

interface HabitCardProps {
  habit: HabitWithStats;
  onCheckIn: (id: string) => void;
  onEdit: (habit: HabitWithStats) => void;
  onDelete: (id: string) => void;
}

export function HabitCard({ habit, onCheckIn, onEdit, onDelete }: HabitCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { stats } = habit;
  const categoryColor = getCategoryColor(habit.category);
  const categoryLabel = getCategoryLabel(habit.category);
  const completionPct = Math.round(stats.completion_rate);

  return (
    <div className="card p-5 flex flex-col gap-4 relative group">
      {/* Category accent */}
      <div
        className="absolute top-0 left-0 w-1 h-full rounded-l-xl"
        style={{ backgroundColor: categoryColor }}
      />

      <div className="flex items-start justify-between pl-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">{habit.name}</h3>
            <Badge variant="default" className="shrink-0">
              <span style={{ color: categoryColor }}>{categoryLabel}</span>
            </Badge>
          </div>
          {habit.description && (
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 truncate">{habit.description}</p>
          )}
        </div>

        {/* Context menu */}
        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical size={16} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10 py-1">
              <button
                onClick={() => { onEdit(habit); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <Edit2 size={14} /> Edit
              </button>
              <button
                onClick={() => { onDelete(habit.id); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Streak */}
      <div className="pl-2 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Flame size={16} className={clsx(stats.current_streak > 0 ? 'text-orange-500' : 'text-gray-300 dark:text-gray-600')} />
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{stats.current_streak}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">day streak</span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Best: <span className="font-medium text-gray-700 dark:text-gray-300">{stats.longest_streak}</span>
        </div>
      </div>

      {/* Completion bar */}
      <div className="pl-2 space-y-1">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Completion rate</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">{completionPct}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${completionPct}%`, backgroundColor: categoryColor }}
          />
        </div>
      </div>

      {/* Check-in */}
      <div className="pl-2">
        <button
          onClick={() => !stats.checked_today && onCheckIn(habit.id)}
          disabled={stats.checked_today}
          className={clsx(
            'w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-150',
            stats.checked_today
              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 cursor-default'
              : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 border border-dashed border-gray-300 dark:border-gray-600'
          )}
        >
          {stats.checked_today ? (
            <><CheckCircle2 size={15} /> Done today!</>
          ) : (
            <><Circle size={15} /> Check in</>
          )}
        </button>
      </div>
    </div>
  );
}
