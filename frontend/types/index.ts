// ─── Shared primitive types ───────────────────────────────────────────────────

export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type RoutineTime = 'morning' | 'afternoon' | 'evening' | 'night';
export type HabitCategory =
  | 'health'
  | 'fitness'
  | 'mindfulness'
  | 'learning'
  | 'productivity'
  | 'social'
  | 'finance'
  | 'creativity'
  | 'other';

// ─── Habit ────────────────────────────────────────────────────────────────────

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  category: HabitCategory;
  color: string;
  frequency: 'daily' | 'weekly';
  target_days?: number[];
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  completed_at: string;
  notes?: string;
}

export interface HabitStats {
  habit_id: string;
  current_streak: number;
  longest_streak: number;
  completion_rate: number;
  total_completions: number;
  last_completed?: string;
  checked_today: boolean;
}

export interface HabitWithStats extends Habit {
  stats: HabitStats;
}

// ─── Task ─────────────────────────────────────────────────────────────────────

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  category?: string;
  due_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  tags: string[];
}

// ─── Routine ──────────────────────────────────────────────────────────────────

export interface Routine {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  time_of_day: RoutineTime;
  duration_minutes: number;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RoutineLog {
  id: string;
  routine_id: string;
  user_id: string;
  completed_at: string;
  date: string;
}

export interface RoutineWithCompletion extends Routine {
  completed_today: boolean;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface DashboardStats {
  total_habits: number;
  tasks_completed_today: number;
  active_streaks: number;
  routines_done_today: number;
  total_tasks: number;
  total_routines: number;
  weekly_habit_rate: number;
}

export interface HeatmapData {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface TrendData {
  date: string;
  habits_completed: number;
  tasks_completed: number;
  routines_completed: number;
  total: number;
}

export interface TaskDistribution {
  name: string;
  value: number;
  color: string;
}

export interface WeeklyActivity {
  day: string;
  habits: number;
  tasks: number;
  routines: number;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
}
