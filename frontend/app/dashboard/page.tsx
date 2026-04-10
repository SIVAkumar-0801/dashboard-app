'use client';

import { format } from 'date-fns';
import { Flame, CheckSquare, ListChecks, TrendingUp, Clock, Zap } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { useAnalytics } from '@/lib/hooks/useAnalytics';
import { useHabits } from '@/lib/hooks/useHabits';
import { useTasks } from '@/lib/hooks/useTasks';
import { useRoutines } from '@/lib/hooks/useRoutines';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Badge } from '@/components/ui/Badge';
import { formatRelativeDate, getCategoryColor } from '@/lib/utils/helpers';

export default function DashboardPage() {
  const { stats, loading: statsLoading } = useAnalytics();
  const { habits } = useHabits();
  const { tasks } = useTasks();
  const { routines } = useRoutines();

  const recentTasks = tasks.slice(0, 5);
  const topHabits = habits.slice(0, 4);
  const todayRoutines = routines.slice(0, 5);
  const completedRoutines = routines.filter((r) => r.completed_today).length;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Good {getTimeGreeting()}, User! 👋
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {format(new Date(), "EEEE, MMMM d, yyyy")} — Let's make today count.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Clock size={14} />
          <span>{format(new Date(), 'h:mm a')}</span>
        </div>
      </div>

      {/* Stats */}
      {statsLoading ? (
        <LoadingSpinner className="py-8" label="Loading stats…" />
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard
            title="Total Habits"
            value={stats?.total_habits ?? habits.length}
            icon={<Flame size={20} />}
            color="amber"
            change={5}
            changeLabel="vs last week"
          />
          <StatsCard
            title="Tasks Completed Today"
            value={stats?.tasks_completed_today ?? tasks.filter((t) => t.status === 'done').length}
            icon={<CheckSquare size={20} />}
            color="indigo"
            change={12}
            changeLabel="vs yesterday"
          />
          <StatsCard
            title="Active Streaks"
            value={stats?.active_streaks ?? habits.filter((h) => h.stats.current_streak > 0).length}
            icon={<TrendingUp size={20} />}
            color="emerald"
            change={0}
          />
          <StatsCard
            title="Routines Done"
            value={`${stats?.routines_done_today ?? completedRoutines} / ${routines.length}`}
            icon={<ListChecks size={20} />}
            color="purple"
          />
        </div>
      )}

      {/* Quick actions */}
      <QuickActions />

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent tasks */}
        <div className="lg:col-span-2 card p-6">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Tasks</h3>
          {recentTasks.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">No tasks yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentTasks.map((task) => (
                <li key={task.id} className="flex items-center gap-3">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      backgroundColor:
                        task.priority === 'urgent' ? '#ef4444'
                        : task.priority === 'high' ? '#f97316'
                        : task.priority === 'medium' ? '#f59e0b'
                        : '#6b7280',
                    }}
                  />
                  <span className={`flex-1 text-sm ${task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    {task.title}
                  </span>
                  <Badge variant={task.status === 'done' ? 'success' : task.status === 'in_progress' ? 'indigo' : 'default'}>
                    {task.status.replace('_', ' ')}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Today's habits */}
        <div className="card p-6">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Today's Habits</h3>
          {topHabits.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">No habits yet.</p>
          ) : (
            <ul className="space-y-3">
              {topHabits.map((habit) => (
                <li key={habit.id} className="flex items-center gap-3">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: getCategoryColor(habit.category) }}
                  />
                  <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate">{habit.name}</span>
                  {habit.stats.checked_today ? (
                    <Badge variant="success" dot>Done</Badge>
                  ) : (
                    <Badge variant="default" dot>Pending</Badge>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function getTimeGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
