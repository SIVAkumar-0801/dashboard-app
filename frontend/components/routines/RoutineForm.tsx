'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { ROUTINE_TIMES } from '@/lib/utils/constants';
import type { Routine } from '@/types';

const schema = z.object({
  name:             z.string().min(1, 'Name is required').max(80),
  description:      z.string().max(200).optional(),
  time_of_day:      z.enum(['morning', 'afternoon', 'evening', 'night']),
  duration_minutes: z.coerce.number().min(1).max(480),
  order_index:      z.coerce.number().min(0).default(0),
});

type FormValues = z.infer<typeof schema>;

interface RoutineFormProps {
  defaultValues?: Partial<FormValues>;
  onSubmit: (values: Omit<Routine, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function RoutineForm({ defaultValues, onSubmit, onCancel, loading }: RoutineFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { time_of_day: 'morning', duration_minutes: 15, order_index: 0, ...defaultValues },
  });

  const submit = (values: FormValues) => {
    onSubmit({ ...values, description: values.description ?? '', is_active: true });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div>
        <label className="label">Routine Name *</label>
        <input {...register('name')} className="input" placeholder="e.g. Morning stretch" />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label className="label">Description</label>
        <textarea {...register('description')} className="input resize-none" rows={2} placeholder="Optional…" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Time of Day *</label>
          <select {...register('time_of_day')} className="input">
            {ROUTINE_TIMES.map((t) => (
              <option key={t.value} value={t.value}>{t.icon} {t.label} ({t.timeRange})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Duration (minutes) *</label>
          <input {...register('duration_minutes')} type="number" min={1} max={480} className="input" />
          {errors.duration_minutes && <p className="mt-1 text-xs text-red-500">{errors.duration_minutes.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>Save Routine</Button>
      </div>
    </form>
  );
}
