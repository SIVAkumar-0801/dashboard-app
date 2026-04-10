'use client';

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useHabits } from '@/lib/hooks/useHabits';
import { HabitCard } from '@/components/habits/HabitCard';
import { HabitForm } from '@/components/habits/HabitForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { Habit, HabitWithStats } from '@/types';

export default function HabitsPage() {
  const { habits, loading, addHabit, editHabit, removeHabit, checkIn } = useHabits();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<HabitWithStats | null>(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const filtered = habits.filter((h) =>
    h.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (values: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    setSaving(true);
    if (editTarget) {
      await editHabit(editTarget.id, values);
    } else {
      await addHabit(values);
    }
    setSaving(false);
    setModalOpen(false);
    setEditTarget(null);
  };

  const openEdit = (habit: HabitWithStats) => {
    setEditTarget(habit);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
  };

  const checkedCount = habits.filter((h) => h.stats.checked_today).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Habits</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {checkedCount} of {habits.length} completed today
          </p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setModalOpen(true)}>
          New Habit
        </Button>
      </div>

      {/* Progress bar */}
      {habits.length > 0 && (
        <div className="card p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-400">Today's progress</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {Math.round((checkedCount / habits.length) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${(checkedCount / habits.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-9"
          placeholder="Search habits…"
        />
      </div>

      {/* Habit grid */}
      {loading ? (
        <LoadingSpinner className="py-16" label="Loading habits…" />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          {search ? 'No habits match your search.' : 'No habits yet. Create your first one!'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onCheckIn={checkIn}
              onEdit={openEdit}
              onDelete={removeHabit}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editTarget ? 'Edit Habit' : 'New Habit'}
      >
        <HabitForm
          defaultValues={editTarget ?? undefined}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={saving}
        />
      </Modal>
    </div>
  );
}
