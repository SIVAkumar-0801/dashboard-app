'use client';

import { useAnalytics } from '@/lib/hooks/useAnalytics';
import { useTasks } from '@/lib/hooks/useTasks';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { HabitTrendChart } from '@/components/charts/HabitTrendChart';
import { ActivityHeatmap } from '@/components/charts/ActivityHeatmap';
import { TaskDistributionChart } from '@/components/charts/TaskDistributionChart';
import { WeeklyActivityChart } from '@/components/charts/WeeklyActivityChart';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { BarChart3, Flame, CheckSquare, ListChecks, TrendingUp } from 'lucide-react';

export function AnalyticsDashboard() {
  const { stats, heatmap, trends, weekly, loading } = useAnalytics();
  const { tasks } = useTasks();

  if (loading) return <LoadingSpinner className="py-20" label="Loading analytics…" />;

  return (
    <div className="space-y-6">
      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Habits"        value={stats.total_habits}          icon={<Flame size={20} />}       color="amber"  />
          <StatsCard title="Tasks Completed Today" value={stats.tasks_completed_today} icon={<CheckSquare size={20} />}  color="indigo" />
          <StatsCard title="Active Streaks"       value={stats.active_streaks}         icon={<TrendingUp size={20} />}  color="emerald" />
          <StatsCard title="Weekly Habit Rate"   value={`${stats.weekly_habit_rate}%`} icon={<BarChart3 size={20} />}   color="purple" />
        </div>
      )}

      {/* Charts */}
      <HabitTrendChart data={trends} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskDistributionChart tasks={tasks} />
        <WeeklyActivityChart data={weekly} />
      </div>

      <ActivityHeatmap data={heatmap} />
    </div>
  );
}
