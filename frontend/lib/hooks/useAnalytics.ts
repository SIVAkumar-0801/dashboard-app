'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  getDashboardStats,
  getHeatmapData,
  getTrends,
  getWeeklyActivity,
} from '@/lib/api-client';
import type { DashboardStats, HeatmapData, TrendData, WeeklyActivity } from '@/types';
import { MOCK_STATS, MOCK_HEATMAP, MOCK_TRENDS, MOCK_WEEKLY } from '@/lib/mock-data';

export function useAnalytics() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [heatmap, setHeatmap] = useState<HeatmapData[]>([]);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [weekly, setWeekly] = useState<WeeklyActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [s, h, t, w] = await Promise.all([
        getDashboardStats(),
        getHeatmapData(),
        getTrends(30),
        getWeeklyActivity(),
      ]);
      setStats(s);
      setHeatmap(h);
      setTrends(t);
      setWeekly(w);
    } catch {
      setStats(MOCK_STATS);
      setHeatmap(MOCK_HEATMAP);
      setTrends(MOCK_TRENDS);
      setWeekly(MOCK_WEEKLY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { stats, heatmap, trends, weekly, loading, refetch: fetchAll };
}
