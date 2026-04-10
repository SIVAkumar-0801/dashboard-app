'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  checkInRoutine,
  createRoutine,
  deleteRoutine,
  getRoutines,
} from '@/lib/api-client';
import type { Routine, RoutineWithCompletion } from '@/types';
import { generateId } from '@/lib/utils/helpers';
import { MOCK_ROUTINES } from '@/lib/mock-data';

export function useRoutines() {
  const [routines, setRoutines] = useState<RoutineWithCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutines = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getRoutines();
      setRoutines(data);
      setError(null);
    } catch {
      setRoutines(MOCK_ROUTINES);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoutines();
  }, [fetchRoutines]);

  const addRoutine = useCallback(
    async (payload: Omit<Routine, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      try {
        const created = await createRoutine(payload);
        setRoutines((prev) => [...prev, { ...created, completed_today: false }]);
        toast.success('Routine created!');
      } catch {
        const optimistic: RoutineWithCompletion = {
          ...payload,
          id: generateId(),
          user_id: 'local',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          completed_today: false,
        };
        setRoutines((prev) => [...prev, optimistic]);
        toast.success('Routine created (offline mode)');
      }
    },
    []
  );

  const removeRoutine = useCallback(async (id: string) => {
    try {
      await deleteRoutine(id);
    } catch {
      // ignore
    }
    setRoutines((prev) => prev.filter((r) => r.id !== id));
    toast.success('Routine deleted');
  }, []);

  const toggleComplete = useCallback(async (id: string) => {
    try {
      await checkInRoutine(id);
    } catch {
      // offline
    }
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, completed_today: !r.completed_today } : r
      )
    );
  }, []);

  return { routines, loading, error, fetchRoutines, addRoutine, removeRoutine, toggleComplete };
}
