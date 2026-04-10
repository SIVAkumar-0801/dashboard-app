'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { WeeklyActivity } from '@/types';

interface WeeklyActivityChartProps {
  data: WeeklyActivity[];
}

export function WeeklyActivityChart({ data }: WeeklyActivityChartProps) {
  return (
    <div className="card p-6">
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Weekly Activity
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -10 }} barSize={14} barGap={3}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9ca3af' }} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px' }}
            cursor={{ fill: 'rgba(99,102,241,0.08)' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
          <Bar dataKey="habits"   name="Habits"   fill="#6366f1" radius={[4, 4, 0, 0]} />
          <Bar dataKey="tasks"    name="Tasks"    fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="routines" name="Routines" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
