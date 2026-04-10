'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  checkInHabit,
  createHabit,
  deleteHabit,
  getHabits,
  updateHabit,
} from '@/lib/api-client';
import type { Habit, HabitWithStats } from '@/types';
import { generateId } from '@/lib/utils/helpers';
import { MOCK_HABITS } from '@/lib/mock-data';

export function useHabits() {
  const [habits, setHabits] = useState<HabitWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHabits = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getHabits();
      setHabits(data);
      setError(null);
    } catch {
      setHabits(MOCK_HABITS);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const addHabit = useCallback(
    async (payload: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      try {
        const created = await createHabit(payload);
        const withStats: HabitWithStats = {
          ...created,
          stats: {
            habit_id: created.id,
            current_streak: 0,
            longest_streak: 0,
            completion_rate: 0,
            total_completions: 0,
            checked_today: false,
          },
        };
        setHabits((prev) => [withStats, ...prev]);
        toast.success('Habit created!');
      } catch {
        const optimistic: HabitWithStats = {
          ...payload,
          id: generateId(),
          user_id: 'local',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          stats: {
            habit_id: 'local',
            current_streak: 0,
            longest_streak: 0,
            completion_rate: 0,
            total_completions: 0,
            checked_today: false,
          },
        };
        setHabits((prev) => [optimistic, ...prev]);
        toast.success('Habit created (offline mode)');
      }
    },
    []
  );

  const editHabit = useCallback(async (id: string, payload: Partial<Habit>) => {
    try {
      const updated = await updateHabit(id, payload);
      setHabits((prev) =>
        prev.map((h) => (h.id === id ? { ...h, ...updated } : h))
      );
      toast.success('Habit updated!');
    } catch {
      setHabits((prev) =>
        prev.map((h) => (h.id === id ? { ...h, ...payload } : h))
      );
      toast.success('Habit updated (offline mode)');
    }
  }, []);

  const removeHabit = useCallback(async (id: string) => {
    try {
      await deleteHabit(id);
    } catch {
      // ignore
    }
    setHabits((prev) => prev.filter((h) => h.id !== id));
    toast.success('Habit deleted');
  }, []);

  const checkIn = useCallback(async (id: string, notes?: string) => {
    try {
      await checkInHabit(id, notes);
    } catch {
      // offline
    }
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              stats: {
                ...h.stats,
                checked_today: true,
                current_streak: h.stats.current_streak + 1,
                total_completions: h.stats.total_completions + 1,
              },
            }
          : h
      )
    );
    toast.success('Habit checked in! 🔥');
  }, []);

  return { habits, loading, error, fetchHabits, addHabit, editHabit, removeHabit, checkIn };
}
