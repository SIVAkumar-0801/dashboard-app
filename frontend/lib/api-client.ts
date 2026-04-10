import axios from 'axios';
import type {
  ApiResponse,
  DashboardStats,
  Habit,
  HabitWithStats,
  HeatmapData,
  Routine,
  RoutineWithCompletion,
  Task,
  TrendData,
  WeeklyActivity,
} from '@/types';
import { API_BASE_URL } from './utils/constants';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[API]', err.message);
    return Promise.reject(err);
  }
);

// ─── Habits ───────────────────────────────────────────────────────────────────

export async function getHabits(): Promise<HabitWithStats[]> {
  const { data } = await client.get<ApiResponse<HabitWithStats[]>>('/habits');
  return data.data;
}

export async function createHabit(payload: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Habit> {
  const { data } = await client.post<ApiResponse<Habit>>('/habits', payload);
  return data.data;
}

export async function updateHabit(id: string, payload: Partial<Habit>): Promise<Habit> {
  const { data } = await client.put<ApiResponse<Habit>>(`/habits/${id}`, payload);
  return data.data;
}

export async function deleteHabit(id: string): Promise<void> {
  await client.delete(`/habits/${id}`);
}

export async function checkInHabit(id: string, notes?: string): Promise<void> {
  await client.post(`/habits/${id}/checkin`, { notes });
}

// ─── Tasks ────────────────────────────────────────────────────────────────────

export async function getTasks(): Promise<Task[]> {
  const { data } = await client.get<ApiResponse<Task[]>>('/tasks');
  return data.data;
}

export async function createTask(payload: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Task> {
  const { data } = await client.post<ApiResponse<Task>>('/tasks', payload);
  return data.data;
}

export async function updateTask(id: string, payload: Partial<Task>): Promise<Task> {
  const { data } = await client.put<ApiResponse<Task>>(`/tasks/${id}`, payload);
  return data.data;
}

export async function deleteTask(id: string): Promise<void> {
  await client.delete(`/tasks/${id}`);
}

export async function updateTaskStatus(id: string, status: Task['status']): Promise<Task> {
  const { data } = await client.patch<ApiResponse<Task>>(`/tasks/${id}/status`, { status });
  return data.data;
}

// ─── Routines ─────────────────────────────────────────────────────────────────

export async function getRoutines(): Promise<RoutineWithCompletion[]> {
  const { data } = await client.get<ApiResponse<RoutineWithCompletion[]>>('/routines');
  return data.data;
}

export async function createRoutine(payload: Omit<Routine, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Routine> {
  const { data } = await client.post<ApiResponse<Routine>>('/routines', payload);
  return data.data;
}

export async function deleteRoutine(id: string): Promise<void> {
  await client.delete(`/routines/${id}`);
}

export async function checkInRoutine(id: string): Promise<void> {
  await client.post(`/routines/${id}/checkin`);
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await client.get<ApiResponse<DashboardStats>>('/analytics/stats');
  return data.data;
}

export async function getHabitAnalytics(): Promise<HabitWithStats[]> {
  const { data } = await client.get<ApiResponse<HabitWithStats[]>>('/analytics/habits');
  return data.data;
}

export async function getTaskAnalytics() {
  const { data } = await client.get('/analytics/tasks');
  return data.data;
}

export async function getHeatmapData(): Promise<HeatmapData[]> {
  const { data } = await client.get<ApiResponse<HeatmapData[]>>('/analytics/heatmap');
  return data.data;
}

export async function getTrends(days = 30): Promise<TrendData[]> {
  const { data } = await client.get<ApiResponse<TrendData[]>>(`/analytics/trends?days=${days}`);
  return data.data;
}

export async function getWeeklyActivity(): Promise<WeeklyActivity[]> {
  const { data } = await client.get<ApiResponse<WeeklyActivity[]>>('/analytics/weekly');
  return data.data;
}
