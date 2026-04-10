import { HabitCategory, Priority, RoutineTime, TaskStatus } from '@/types';

export const HABIT_CATEGORIES: { value: HabitCategory; label: string; color: string }[] = [
  { value: 'health',        label: 'Health',        color: '#10b981' },
  { value: 'fitness',       label: 'Fitness',       color: '#f59e0b' },
  { value: 'mindfulness',   label: 'Mindfulness',   color: '#8b5cf6' },
  { value: 'learning',      label: 'Learning',      color: '#3b82f6' },
  { value: 'productivity',  label: 'Productivity',  color: '#6366f1' },
  { value: 'social',        label: 'Social',        color: '#ec4899' },
  { value: 'finance',       label: 'Finance',       color: '#14b8a6' },
  { value: 'creativity',    label: 'Creativity',    color: '#f97316' },
  { value: 'other',         label: 'Other',         color: '#6b7280' },
];

export const TASK_PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: 'low',    label: 'Low',    color: '#6b7280' },
  { value: 'medium', label: 'Medium', color: '#f59e0b' },
  { value: 'high',   label: 'High',   color: '#f97316' },
  { value: 'urgent', label: 'Urgent', color: '#ef4444' },
];

export const TASK_STATUSES: { value: TaskStatus; label: string }[] = [
  { value: 'todo',        label: 'To Do'       },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done',        label: 'Done'        },
];

export const ROUTINE_TIMES: { value: RoutineTime; label: string; icon: string; timeRange: string }[] = [
  { value: 'morning',   label: 'Morning',   icon: '🌅', timeRange: '5:00 – 12:00' },
  { value: 'afternoon', label: 'Afternoon', icon: '☀️',  timeRange: '12:00 – 17:00' },
  { value: 'evening',   label: 'Evening',   icon: '🌆', timeRange: '17:00 – 21:00' },
  { value: 'night',     label: 'Night',     icon: '🌙', timeRange: '21:00 – 5:00'  },
];

export const CHART_COLORS = {
  primary:   '#6366f1',
  secondary: '#8b5cf6',
  success:   '#10b981',
  warning:   '#f59e0b',
  danger:    '#ef4444',
  info:      '#3b82f6',
  muted:     '#6b7280',
  palette: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#f97316', '#14b8a6'],
};

export const HEATMAP_COLORS = ['#1f2937', '#312e81', '#4338ca', '#4f46e5', '#6366f1'];

export const APP_NAME = 'Dashboard';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
