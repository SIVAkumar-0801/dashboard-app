'use client';

import { TaskCard } from './TaskCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { Task, TaskStatus } from '@/types';

interface Column {
  id: TaskStatus;
  label: string;
  color: string;
  headerColor: string;
}

const COLUMNS: Column[] = [
  { id: 'todo',        label: 'To Do',       color: 'border-gray-300 dark:border-gray-600',   headerColor: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300' },
  { id: 'in_progress', label: 'In Progress',  color: 'border-indigo-300 dark:border-indigo-700', headerColor: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' },
  { id: 'done',        label: 'Done',         color: 'border-emerald-300 dark:border-emerald-700', headerColor: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' },
];

interface TaskBoardProps {
  tasks: Task[];
  loading: boolean;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

export function TaskBoard({ tasks, loading, onStatusChange, onDelete }: TaskBoardProps) {
  if (loading) {
    return <LoadingSpinner className="py-20" label="Loading tasks…" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);
        return (
          <div key={col.id} className={`flex flex-col rounded-xl border-2 ${col.color} min-h-[400px]`}>
            {/* Column header */}
            <div className={`flex items-center justify-between px-4 py-3 rounded-t-xl ${col.headerColor}`}>
              <span className="font-semibold text-sm">{col.label}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/50 dark:bg-black/20">
                {colTasks.length}
              </span>
            </div>

            {/* Tasks */}
            <div className="flex flex-col gap-3 p-3 flex-1">
              {colTasks.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm">
                  No tasks
                </div>
              ) : (
                colTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={onStatusChange}
                    onDelete={onDelete}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
