import { subDays, format } from 'date-fns';
import type {
  DashboardStats,
  HabitWithStats,
  HeatmapData,
  RoutineWithCompletion,
  Task,
  TrendData,
  WeeklyActivity,
} from '@/types';

// ─── Habits ───────────────────────────────────────────────────────────────────

export const MOCK_HABITS: HabitWithStats[] = [
  {
    id: 'h1',
    user_id: 'demo',
    name: 'Morning Meditation',
    description: '10 minutes of mindfulness',
    category: 'mindfulness',
    color: '#8b5cf6',
    frequency: 'daily',
    is_active: true,
    created_at: subDays(new Date(), 60).toISOString(),
    updated_at: new Date().toISOString(),
    stats: { habit_id: 'h1', current_streak: 14, longest_streak: 21, completion_rate: 87, total_completions: 52, last_completed: new Date().toISOString(), checked_today: true },
  },
  {
    id: 'h2',
    user_id: 'demo',
    name: 'Exercise 30 min',
    description: 'Cardio or strength training',
    category: 'fitness',
    color: '#f59e0b',
    frequency: 'daily',
    is_active: true,
    created_at: subDays(new Date(), 45).toISOString(),
    updated_at: new Date().toISOString(),
    stats: { habit_id: 'h2', current_streak: 7, longest_streak: 15, completion_rate: 73, total_completions: 33, last_completed: subDays(new Date(), 1).toISOString(), checked_today: false },
  },
  {
    id: 'h3',
    user_id: 'demo',
    name: 'Read 20 pages',
    description: 'Non-fiction or fiction',
    category: 'learning',
    color: '#3b82f6',
    frequency: 'daily',
    is_active: true,
    created_at: subDays(new Date(), 30).toISOString(),
    updated_at: new Date().toISOString(),
    stats: { habit_id: 'h3', current_streak: 3, longest_streak: 10, completion_rate: 60, total_completions: 18, last_completed: subDays(new Date(), 1).toISOString(), checked_today: false },
  },
  {
    id: 'h4',
    user_id: 'demo',
    name: 'Drink 8 glasses of water',
    description: 'Stay hydrated',
    category: 'health',
    color: '#10b981',
    frequency: 'daily',
    is_active: true,
    created_at: subDays(new Date(), 20).toISOString(),
    updated_at: new Date().toISOString(),
    stats: { habit_id: 'h4', current_streak: 5, longest_streak: 12, completion_rate: 80, total_completions: 16, last_completed: new Date().toISOString(), checked_today: true },
  },
  {
    id: 'h5',
    user_id: 'demo',
    name: 'Journal',
    description: 'Write daily reflections',
    category: 'mindfulness',
    color: '#ec4899',
    frequency: 'daily',
    is_active: true,
    created_at: subDays(new Date(), 15).toISOString(),
    updated_at: new Date().toISOString(),
    stats: { habit_id: 'h5', current_streak: 2, longest_streak: 7, completion_rate: 53, total_completions: 8, checked_today: false },
  },
];

// ─── Tasks ────────────────────────────────────────────────────────────────────

export const MOCK_TASKS: Task[] = [
  { id: 't1', user_id: 'demo', title: 'Design new dashboard layout', description: 'Create wireframes and mockups', status: 'in_progress', priority: 'high', category: 'Design', due_date: subDays(new Date(), -2).toISOString(), tags: ['design', 'ui'], created_at: subDays(new Date(), 5).toISOString(), updated_at: new Date().toISOString() },
  { id: 't2', user_id: 'demo', title: 'Implement authentication', description: 'JWT + refresh tokens', status: 'todo', priority: 'urgent', category: 'Backend', due_date: subDays(new Date(), -1).toISOString(), tags: ['auth', 'security'], created_at: subDays(new Date(), 3).toISOString(), updated_at: new Date().toISOString() },
  { id: 't3', user_id: 'demo', title: 'Write unit tests', description: 'Cover core business logic', status: 'todo', priority: 'medium', category: 'Testing', tags: ['tests'], created_at: subDays(new Date(), 2).toISOString(), updated_at: new Date().toISOString() },
  { id: 't4', user_id: 'demo', title: 'Update README', description: 'Add setup instructions', status: 'done', priority: 'low', category: 'Docs', completed_at: subDays(new Date(), 1).toISOString(), tags: ['docs'], created_at: subDays(new Date(), 7).toISOString(), updated_at: subDays(new Date(), 1).toISOString() },
  { id: 't5', user_id: 'demo', title: 'Performance optimisation', description: 'Reduce bundle size', status: 'todo', priority: 'medium', category: 'Frontend', tags: ['perf'], created_at: subDays(new Date(), 1).toISOString(), updated_at: new Date().toISOString() },
  { id: 't6', user_id: 'demo', title: 'Deploy to production', description: 'CI/CD pipeline setup', status: 'in_progress', priority: 'urgent', category: 'DevOps', tags: ['deploy'], created_at: subDays(new Date(), 4).toISOString(), updated_at: new Date().toISOString() },
  { id: 't7', user_id: 'demo', title: 'Code review', description: 'Review open PRs', status: 'done', priority: 'high', completed_at: new Date().toISOString(), tags: [], created_at: subDays(new Date(), 6).toISOString(), updated_at: new Date().toISOString() },
];

// ─── Routines ─────────────────────────────────────────────────────────────────

export const MOCK_ROUTINES: RoutineWithCompletion[] = [
  { id: 'r1', user_id: 'demo', name: 'Wake up & stretch', time_of_day: 'morning', duration_minutes: 10, order_index: 0, is_active: true, completed_today: true,  created_at: subDays(new Date(), 30).toISOString(), updated_at: new Date().toISOString() },
  { id: 'r2', user_id: 'demo', name: 'Cold shower', time_of_day: 'morning', duration_minutes: 5, order_index: 1, is_active: true, completed_today: true, created_at: subDays(new Date(), 30).toISOString(), updated_at: new Date().toISOString() },
  { id: 'r3', user_id: 'demo', name: 'Healthy breakfast', time_of_day: 'morning', duration_minutes: 20, order_index: 2, is_active: true, completed_today: false, created_at: subDays(new Date(), 30).toISOString(), updated_at: new Date().toISOString() },
  { id: 'r4', user_id: 'demo', name: 'Plan the day', time_of_day: 'morning', duration_minutes: 15, order_index: 3, is_active: true, completed_today: false, created_at: subDays(new Date(), 25).toISOString(), updated_at: new Date().toISOString() },
  { id: 'r5', user_id: 'demo', name: 'Lunch walk', time_of_day: 'afternoon', duration_minutes: 20, order_index: 0, is_active: true, completed_today: false, created_at: subDays(new Date(), 20).toISOString(), updated_at: new Date().toISOString() },
  { id: 'r6', user_id: 'demo', name: 'Review emails', time_of_day: 'afternoon', duration_minutes: 30, order_index: 1, is_active: true, completed_today: true, created_at: subDays(new Date(), 20).toISOString(), updated_at: new Date().toISOString() },
  { id: 'r7', user_id: 'demo', name: 'Evening workout', time_of_day: 'evening', duration_minutes: 45, order_index: 0, is_active: true, completed_today: false, created_at: subDays(new Date(), 15).toISOString(), updated_at: new Date().toISOString() },
  { id: 'r8', user_id: 'demo', name: 'Read before bed', time_of_day: 'night', duration_minutes: 30, order_index: 0, is_active: true, completed_today: false, created_at: subDays(new Date(), 10).toISOString(), updated_at: new Date().toISOString() },
  { id: 'r9', user_id: 'demo', name: 'Digital detox', time_of_day: 'night', duration_minutes: 60, order_index: 1, is_active: true, completed_today: false, created_at: subDays(new Date(), 10).toISOString(), updated_at: new Date().toISOString() },
];

// ─── Stats ────────────────────────────────────────────────────────────────────

export const MOCK_STATS: DashboardStats = {
  total_habits: 5,
  tasks_completed_today: 2,
  active_streaks: 3,
  routines_done_today: 3,
  total_tasks: 7,
  total_routines: 9,
  weekly_habit_rate: 74,
};

// ─── Heatmap ──────────────────────────────────────────────────────────────────

export const MOCK_HEATMAP: HeatmapData[] = Array.from({ length: 365 }, (_, i) => {
  const date = format(subDays(new Date(), 364 - i), 'yyyy-MM-dd');
  const r = Math.random();
  const count = r < 0.2 ? 0 : r < 0.45 ? 1 : r < 0.65 ? 2 : r < 0.82 ? 3 : 4;
  return { date, count, level: count as 0 | 1 | 2 | 3 | 4 };
});

// ─── Trends ───────────────────────────────────────────────────────────────────

export const MOCK_TRENDS: TrendData[] = Array.from({ length: 30 }, (_, i) => {
  const date = format(subDays(new Date(), 29 - i), 'yyyy-MM-dd');
  const habits_completed    = Math.floor(Math.random() * 5) + 1;
  const tasks_completed     = Math.floor(Math.random() * 4);
  const routines_completed  = Math.floor(Math.random() * 4) + 1;
  return { date, habits_completed, tasks_completed, routines_completed, total: habits_completed + tasks_completed + routines_completed };
});

// ─── Weekly ───────────────────────────────────────────────────────────────────

export const MOCK_WEEKLY: WeeklyActivity[] = [
  { day: 'Mon', habits: 4, tasks: 3, routines: 5 },
  { day: 'Tue', habits: 5, tasks: 2, routines: 4 },
  { day: 'Wed', habits: 3, tasks: 4, routines: 3 },
  { day: 'Thu', habits: 5, tasks: 5, routines: 5 },
  { day: 'Fri', habits: 4, tasks: 3, routines: 4 },
  { day: 'Sat', habits: 2, tasks: 1, routines: 3 },
  { day: 'Sun', habits: 3, tasks: 0, routines: 2 },
];
