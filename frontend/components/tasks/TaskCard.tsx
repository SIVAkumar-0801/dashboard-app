'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getPriorityColor } from '@/lib/utils/helpers';
import { formatDate } from '@/lib/utils/helpers';
import type { Task, TaskStatus } from '@/types';
import { Calendar, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

const STATUS_NEXT: Record<TaskStatus, { label: string; next: TaskStatus }> = {
  todo:        { label: 'Start',    next: 'in_progress' },
  in_progress: { label: 'Complete', next: 'done'        },
  done:        { label: 'Reopen',   next: 'todo'        },
};

const PRIORITY_BADGE: Record<string, 'default' | 'warning' | 'danger' | 'info'> = {
  low:    'default',
  medium: 'warning',
  high:   'danger',
  urgent: 'danger',
};

export function TaskCard({ task, onStatusChange, onDelete }: TaskCardProps) {
  const priorityColor = getPriorityColor(task.priority);
  const { label: btnLabel, next } = STATUS_NEXT[task.status];

  return (
    <div className="card p-4 flex flex-col gap-3 group">
      <div className="flex items-start gap-3">
        {/* Priority stripe */}
        <div className="w-1 h-full min-h-[2rem] rounded-full shrink-0 mt-0.5" style={{ backgroundColor: priorityColor }} />
        <div className="flex-1 min-w-0">
          <p className={clsx('font-medium text-sm text-gray-900 dark:text-gray-100', task.status === 'done' && 'line-through text-gray-400 dark:text-gray-500')}>
            {task.title}
          </p>
          {task.description && (
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{task.description}</p>
          )}
        </div>
        <button
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all shrink-0"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap pl-3">
        <Badge variant={PRIORITY_BADGE[task.priority] ?? 'default'}>
          {task.priority}
        </Badge>
        {task.category && (
          <Badge variant="info">{task.category}</Badge>
        )}
        {task.due_date && (
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 ml-auto">
            <Calendar size={11} />
            {formatDate(task.due_date, 'MMM d')}
          </div>
        )}
      </div>

      <div className="pl-3">
        <Button
          size="sm"
          variant={task.status === 'done' ? 'ghost' : 'primary'}
          className="w-full"
          onClick={() => onStatusChange(task.id, next)}
        >
          {btnLabel}
        </Button>
      </div>
    </div>
  );
}
