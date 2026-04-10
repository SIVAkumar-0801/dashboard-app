'use client';

import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useTasks } from '@/lib/hooks/useTasks';
import { TaskBoard } from '@/components/tasks/TaskBoard';
import { TaskForm } from '@/components/tasks/TaskForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { Task, TaskStatus, Priority } from '@/types';
import { TASK_PRIORITIES } from '@/lib/utils/constants';

export default function TasksPage() {
  const { tasks, loading, addTask, changeStatus, removeTask } = useTasks();
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [saving, setSaving] = useState(false);

  const filtered = tasks.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchSearch && matchPriority;
  });

  const handleSubmit = async (values: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    setSaving(true);
    await addTask(values);
    setSaving(false);
    setModalOpen(false);
  };

  const todoCount = tasks.filter((t) => t.status === 'todo').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;
  const doneCount = tasks.filter((t) => t.status === 'done').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Tasks</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">{todoCount} todo</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{inProgressCount} in progress</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{doneCount} done</span>
          </div>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setModalOpen(true)}>
          New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9"
            placeholder="Search tasks…"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={15} className="text-gray-400 shrink-0" />
          <button
            onClick={() => setPriorityFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${priorityFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
          >
            All
          </button>
          {TASK_PRIORITIES.map((p) => (
            <button
              key={p.value}
              onClick={() => setPriorityFilter(p.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${priorityFilter === p.value ? 'text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
              style={priorityFilter === p.value ? { backgroundColor: p.color } : {}}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Board */}
      <TaskBoard
        tasks={filtered}
        loading={loading}
        onStatusChange={changeStatus}
        onDelete={removeTask}
      />

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Task">
        <TaskForm
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          loading={saving}
        />
      </Modal>
    </div>
  );
}
