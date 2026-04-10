'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Task } from '@/types';
import { CHART_COLORS } from '@/lib/utils/constants';

interface TaskDistributionChartProps {
  tasks: Task[];
}

export function TaskDistributionChart({ tasks }: TaskDistributionChartProps) {
  const statusData = [
    { name: 'To Do',       value: tasks.filter((t) => t.status === 'todo').length,        color: '#6b7280' },
    { name: 'In Progress', value: tasks.filter((t) => t.status === 'in_progress').length, color: '#6366f1' },
    { name: 'Done',        value: tasks.filter((t) => t.status === 'done').length,        color: '#10b981' },
  ].filter((d) => d.value > 0);

  const priorityData = [
    { name: 'Low',    value: tasks.filter((t) => t.priority === 'low').length,    color: '#6b7280' },
    { name: 'Medium', value: tasks.filter((t) => t.priority === 'medium').length, color: '#f59e0b' },
    { name: 'High',   value: tasks.filter((t) => t.priority === 'high').length,   color: '#f97316' },
    { name: 'Urgent', value: tasks.filter((t) => t.priority === 'urgent').length, color: '#ef4444' },
  ].filter((d) => d.value > 0);

  return (
    <div className="card p-6">
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Task Distribution
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 text-center">By Status</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 text-center">By Priority</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={priorityData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {priorityData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
