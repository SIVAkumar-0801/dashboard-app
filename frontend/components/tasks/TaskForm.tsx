'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { TASK_PRIORITIES } from '@/lib/utils/constants';
import type { Task } from '@/types';

const schema = z.object({
  title:       z.string().min(1, 'Title is required').max(120),
  description: z.string().max(500).optional(),
  priority:    z.enum(['low', 'medium', 'high', 'urgent']),
  category:    z.string().max(50).optional(),
  due_date:    z.string().optional(),
  status:      z.enum(['todo', 'in_progress', 'done']),
});

type FormValues = z.infer<typeof schema>;

interface TaskFormProps {
  defaultValues?: Partial<FormValues>;
  onSubmit: (values: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function TaskForm({ defaultValues, onSubmit, onCancel, loading }: TaskFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { priority: 'medium', status: 'todo', ...defaultValues },
  });

  const submit = (values: FormValues) => {
    onSubmit({ ...values, description: values.description ?? '', category: values.category ?? '', due_date: values.due_date ?? '', tags: [] });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div>
        <label className="label">Title *</label>
        <input {...register('title')} className="input" placeholder="Task title…" />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
      </div>

      <div>
        <label className="label">Description</label>
        <textarea {...register('description')} className="input resize-none" rows={3} placeholder="Optional description…" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Priority</label>
          <select {...register('priority')} className="input">
            {TASK_PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Status</label>
          <select {...register('status')} className="input">
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Category</label>
          <input {...register('category')} className="input" placeholder="e.g. Design" />
        </div>
        <div>
          <label className="label">Due Date</label>
          <input {...register('due_date')} type="date" className="input" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>Save Task</Button>
      </div>
    </form>
  );
}
