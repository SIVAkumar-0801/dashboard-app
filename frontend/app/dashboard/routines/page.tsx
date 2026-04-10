'use client';

import { useState } from 'react';
import { Plus, Clock } from 'lucide-react';
import { useRoutines } from '@/lib/hooks/useRoutines';
import { RoutineCard } from '@/components/routines/RoutineCard';
import { RoutineForm } from '@/components/routines/RoutineForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ROUTINE_TIMES } from '@/lib/utils/constants';
import { formatDuration } from '@/lib/utils/helpers';
import type { Routine, RoutineTime } from '@/types';

export default function RoutinesPage() {
  const { routines, loading, addRoutine, removeRoutine, toggleComplete } = useRoutines();
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (values: Omit<Routine, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    setSaving(true);
    await addRoutine(values);
    setSaving(false);
    setModalOpen(false);
  };

  const completedCount = routines.filter((r) => r.completed_today).length;
  const totalDuration = routines.reduce((sum, r) => sum + r.duration_minutes, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Routines</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
            <Clock size={13} />
            {completedCount}/{routines.length} done today &nbsp;·&nbsp; Total: {formatDuration(totalDuration)}
          </p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setModalOpen(true)}>
          New Routine
        </Button>
      </div>

      {/* Progress */}
      {routines.length > 0 && (
        <div className="card p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-400">Today's progress</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {Math.round((completedCount / routines.length) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / routines.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {loading ? (
        <LoadingSpinner className="py-16" label="Loading routines…" />
      ) : routines.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          No routines yet. Create your first one!
        </div>
      ) : (
        <div className="space-y-8">
          {ROUTINE_TIMES.map(({ value, label, icon, timeRange }) => {
            const group = routines
              .filter((r) => r.time_of_day === value)
              .sort((a, b) => a.order_index - b.order_index);
            if (group.length === 0) return null;
            const groupDone = group.filter((r) => r.completed_today).length;
            return (
              <div key={value}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{icon}</span>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{label}</h3>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{timeRange}</span>
                  <span className="ml-auto text-xs font-medium text-gray-500 dark:text-gray-400">
                    {groupDone}/{group.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {group.map((routine) => (
                    <RoutineCard
                      key={routine.id}
                      routine={routine}
                      onToggle={toggleComplete}
                      onDelete={removeRoutine}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Routine">
        <RoutineForm
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          loading={saving}
        />
      </Modal>
    </div>
  );
}
