'use client';

import { clsx } from 'clsx';
import { CheckCircle2, Circle, Clock, Trash2 } from 'lucide-react';
import { formatDuration } from '@/lib/utils/helpers';
import { ROUTINE_TIMES } from '@/lib/utils/constants';
import type { RoutineWithCompletion } from '@/types';

interface RoutineCardProps {
  routine: RoutineWithCompletion;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function RoutineCard({ routine, onToggle, onDelete }: RoutineCardProps) {
  const timeInfo = ROUTINE_TIMES.find((t) => t.value === routine.time_of_day);

  return (
    <div
      className={clsx(
        'card p-4 flex items-center gap-4 group transition-all duration-150',
        routine.completed_today && 'opacity-70'
      )}
    >
      <button
        onClick={() => onToggle(routine.id)}
        className="shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full"
      >
        {routine.completed_today ? (
          <CheckCircle2 size={22} className="text-emerald-500" />
        ) : (
          <Circle size={22} className="text-gray-300 dark:text-gray-600 hover:text-indigo-500 transition-colors" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={clsx('font-medium text-sm text-gray-900 dark:text-gray-100', routine.completed_today && 'line-through text-gray-400 dark:text-gray-500')}>
          {routine.name}
        </p>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Clock size={11} />
            {formatDuration(routine.duration_minutes)}
          </span>
          {timeInfo && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {timeInfo.icon} {timeInfo.timeRange}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete(routine.id)}
        className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-all"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
