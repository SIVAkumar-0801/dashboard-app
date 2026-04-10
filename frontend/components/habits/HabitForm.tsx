'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { HABIT_CATEGORIES } from '@/lib/utils/constants';
import type { Habit } from '@/types';

const schema = z.object({
  name:        z.string().min(1, 'Name is required').max(80),
  description: z.string().max(200).optional(),
  category:    z.enum(['health', 'fitness', 'mindfulness', 'learning', 'productivity', 'social', 'finance', 'creativity', 'other']),
  color:       z.string().min(4),
  frequency:   z.enum(['daily', 'weekly']),
});

type FormValues = z.infer<typeof schema>;

interface HabitFormProps {
  defaultValues?: Partial<FormValues>;
  onSubmit: (values: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function HabitForm({ defaultValues, onSubmit, onCancel, loading }: HabitFormProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      category:  'health',
      frequency: 'daily',
      color:     '#10b981',
      ...defaultValues,
    },
  });

  const selectedCategory = watch('category');

  const submit = (values: FormValues) => {
    const cat = HABIT_CATEGORIES.find((c) => c.value === values.category);
    onSubmit({
      ...values,
      description: values.description ?? '',
      color: values.color || cat?.color || '#6366f1',
      is_active: true,
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div>
        <label className="label">Habit Name *</label>
        <input {...register('name')} className="input" placeholder="e.g. Morning meditation" />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label className="label">Description</label>
        <textarea {...register('description')} className="input resize-none" rows={2} placeholder="Optional description…" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Category *</label>
          <select {...register('category')} className="input">
            {HABIT_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Frequency *</label>
          <select {...register('frequency')} className="input">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label">Color</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {HABIT_CATEGORIES.map((c) => (
            <button
              key={c.color}
              type="button"
              onClick={() => setValue('color', c.color)}
              className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
              style={{
                backgroundColor: c.color,
                borderColor: watch('color') === c.color ? 'white' : 'transparent',
                outline: watch('color') === c.color ? `2px solid ${c.color}` : 'none',
                outlineOffset: '2px',
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>Save Habit</Button>
      </div>
    </form>
  );
}
