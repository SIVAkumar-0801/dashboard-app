'use client';

import { useMemo } from 'react';
import { format, parseISO, startOfWeek, eachWeekOfInterval, subDays } from 'date-fns';
import { clsx } from 'clsx';
import type { HeatmapData } from '@/types';
import { HEATMAP_COLORS } from '@/lib/utils/constants';

interface ActivityHeatmapProps {
  data: HeatmapData[];
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const dataMap = useMemo(() => {
    const m: Record<string, HeatmapData> = {};
    data.forEach((d) => { m[d.date] = d; });
    return m;
  }, [data]);

  const end = new Date();
  const start = subDays(end, 364);
  const weeks = eachWeekOfInterval({ start, end });

  const monthLabels = useMemo(() => {
    const labels: { label: string; col: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((weekStart, col) => {
      const m = weekStart.getMonth();
      if (m !== lastMonth) {
        labels.push({ label: MONTHS[m], col });
        lastMonth = m;
      }
    });
    return labels;
  }, [weeks]);

  return (
    <div className="card p-6">
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Activity Heatmap (Last Year)
      </h3>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-max">
          {/* Month labels */}
          <div className="flex mb-1 pl-8">
            {weeks.map((_, i) => {
              const ml = monthLabels.find((m) => m.col === i);
              return (
                <div key={i} className="w-3 mr-0.5 text-xs text-gray-400 dark:text-gray-500 shrink-0">
                  {ml ? ml.label : ''}
                </div>
              );
            })}
          </div>

          <div className="flex gap-0.5">
            {/* Day labels */}
            <div className="flex flex-col gap-0.5 mr-1">
              {DAYS.map((d, i) => (
                <div key={d} className="h-3 w-6 text-xs text-gray-400 dark:text-gray-500 flex items-center justify-end pr-1">
                  {i % 2 === 1 ? d.slice(0, 1) : ''}
                </div>
              ))}
            </div>

            {/* Cells */}
            {weeks.map((weekStart, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {DAYS.map((_, di) => {
                  const date = new Date(weekStart);
                  date.setDate(date.getDate() + di);
                  const dateStr = format(date, 'yyyy-MM-dd');
                  const cell = dataMap[dateStr];
                  const level = cell?.level ?? 0;
                  return (
                    <div
                      key={di}
                      title={cell ? `${dateStr}: ${cell.count} activities` : dateStr}
                      className="w-3 h-3 rounded-sm cursor-default transition-transform hover:scale-125"
                      style={{ backgroundColor: HEATMAP_COLORS[level] }}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-1.5 mt-3 justify-end">
            <span className="text-xs text-gray-400 dark:text-gray-500">Less</span>
            {HEATMAP_COLORS.map((c, i) => (
              <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
            ))}
            <span className="text-xs text-gray-400 dark:text-gray-500">More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
