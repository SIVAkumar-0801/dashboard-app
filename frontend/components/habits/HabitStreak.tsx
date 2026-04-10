import { Flame } from 'lucide-react';
import { clsx } from 'clsx';

interface HabitStreakProps {
  streak: number;
  longestStreak: number;
  completionRate: number;
}

function StreakDot({ active }: { active: boolean }) {
  return (
    <div
      className={clsx(
        'w-3 h-3 rounded-full',
        active ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-600'
      )}
    />
  );
}

export function HabitStreak({ streak, longestStreak, completionRate }: HabitStreakProps) {
  const days = Array.from({ length: 7 }, (_, i) => i < streak % 7);

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-1.5">
        <Flame
          size={18}
          className={clsx(
            streak > 0 ? 'text-orange-500' : 'text-gray-300 dark:text-gray-600'
          )}
        />
        <span className="font-bold text-lg text-gray-900 dark:text-white">{streak}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">day streak</span>
      </div>

      <div className="flex gap-1">
        {days.map((active, i) => (
          <StreakDot key={i} active={active} />
        ))}
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
        Best: <span className="font-semibold text-gray-700 dark:text-gray-300">{longestStreak}</span> &nbsp;·&nbsp;
        Rate: <span className="font-semibold text-gray-700 dark:text-gray-300">{completionRate}%</span>
      </div>
    </div>
  );
}
