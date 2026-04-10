import React from 'react';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  changeLabel?: string;
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'blue' | 'purple';
  className?: string;
}

const colorMap = {
  indigo:  { bg: 'bg-indigo-50 dark:bg-indigo-900/20',  icon: 'text-indigo-600 dark:text-indigo-400',  ring: 'bg-indigo-100 dark:bg-indigo-900/40' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: 'text-emerald-600 dark:text-emerald-400', ring: 'bg-emerald-100 dark:bg-emerald-900/40' },
  amber:   { bg: 'bg-amber-50 dark:bg-amber-900/20',   icon: 'text-amber-600 dark:text-amber-400',   ring: 'bg-amber-100 dark:bg-amber-900/40' },
  rose:    { bg: 'bg-rose-50 dark:bg-rose-900/20',     icon: 'text-rose-600 dark:text-rose-400',     ring: 'bg-rose-100 dark:bg-rose-900/40' },
  blue:    { bg: 'bg-blue-50 dark:bg-blue-900/20',     icon: 'text-blue-600 dark:text-blue-400',     ring: 'bg-blue-100 dark:bg-blue-900/40' },
  purple:  { bg: 'bg-purple-50 dark:bg-purple-900/20', icon: 'text-purple-600 dark:text-purple-400', ring: 'bg-purple-100 dark:bg-purple-900/40' },
};

export function StatsCard({
  title,
  value,
  icon,
  change,
  changeLabel,
  color = 'indigo',
  className,
}: StatsCardProps) {
  const colors = colorMap[color];
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div className={clsx('card p-6 flex items-start gap-4', className)}>
      <div className={clsx('flex items-center justify-center w-12 h-12 rounded-xl shrink-0', colors.ring)}>
        <span className={colors.icon}>{icon}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</p>
        <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        {change !== undefined && (
          <div className="mt-1 flex items-center gap-1">
            {isPositive && <TrendingUp size={13} className="text-emerald-500" />}
            {isNegative && <TrendingDown size={13} className="text-red-500" />}
            {!isPositive && !isNegative && <Minus size={13} className="text-gray-400" />}
            <span
              className={clsx(
                'text-xs font-medium',
                isPositive && 'text-emerald-600 dark:text-emerald-400',
                isNegative && 'text-red-600 dark:text-red-400',
                !isPositive && !isNegative && 'text-gray-400'
              )}
            >
              {isPositive ? '+' : ''}{change}%
            </span>
            {changeLabel && (
              <span className="text-xs text-gray-400">{changeLabel}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
