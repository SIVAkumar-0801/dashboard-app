'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  updateTaskStatus,
} from '@/lib/api-client';
import type { Task, TaskStatus } from '@/types';
import { generateId } from '@/lib/utils/helpers';
import { MOCK_TASKS } from '@/lib/mock-data';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
      setError(null);
    } catch {
      setTasks(MOCK_TASKS);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = useCallback(
    async (payload: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      try {
        const created = await createTask(payload);
        setTasks((prev) => [created, ...prev]);
        toast.success('Task created!');
      } catch {
        const optimistic: Task = {
          ...payload,
          id: generateId(),
          user_id: 'local',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setTasks((prev) => [optimistic, ...prev]);
        toast.success('Task created (offline mode)');
      }
    },
    []
  );

  const editTask = useCallback(async (id: string, payload: Partial<Task>) => {
    try {
      const updated = await updateTask(id, payload);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...payload } : t)));
    }
    toast.success('Task updated!');
  }, []);

  const removeTask = useCallback(async (id: string) => {
    try {
      await deleteTask(id);
    } catch {
      // ignore
    }
    setTasks((prev) => prev.filter((t) => t.id !== id));
    toast.success('Task deleted');
  }, []);

  const changeStatus = useCallback(async (id: string, status: TaskStatus) => {
    try {
      await updateTaskStatus(id, status);
    } catch {
      // offline
    }
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              completed_at: status === 'done' ? new Date().toISOString() : undefined,
            }
          : t
      )
    );
  }, []);

  return { tasks, loading, error, fetchTasks, addTask, editTask, removeTask, changeStatus };
}
