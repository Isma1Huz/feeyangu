import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Button } from '@/components/Common/Button';
import { Input } from '@/components/Common/Input';
import { Select } from '@/components/Common/Select';
import { Card } from '@/components/Common/Card';
import { Alert } from '@/components/Common/Alert';
import { translations } from '@/lib/data';

interface ClassesCreateProps {
  grade: { id: number; name: string };
  teachers: Array<{ id: number; name: string }>;
}

const ClassesCreate: React.FC<ClassesCreateProps> = ({ grade, teachers }) => {
  const data = translations.classes;
  const common = translations.common;
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const { data: formData, setData, post, processing, errors } = useForm({
    name: '',
    class_teacher_id: '',
    capacity: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    post(`/school/grades/${grade.id}/classes`, {
      onSuccess: () => {
        setSubmitSuccess(common.messages.created);
        setTimeout(() => {
          window.location.href = `/school/grades/${grade.id}/classes`;
        }, 1500);
      },
      onError: () => {
        setSubmitError(common.messages.error);
      },
    });
  };

  const teacherOptions = [
    { value: '', label: `${common.buttons.select} ${data.teacher}` },
    ...teachers.map((t) => ({
      value: t.id.toString(),
      label: t.name,
    })),
  ];

  return (
    <AppLayout title={data.create}>
      <div className="max-w-2xl mx-auto space-y-6">
        {submitError && (
          <Alert
            type="error"
            message={submitError}
            onClose={() => setSubmitError('')}
          />
        )}

        {submitSuccess && (
          <Alert
            type="success"
            message={submitSuccess}
            onClose={() => setSubmitSuccess('')}
          />
        )}

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Grade: <span className="font-bold">{grade.name}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={data.name}
                required
                placeholder="e.g., A, B, C"
                value={formData.name}
                onChange={(e) => setData('name', e.target.value)}
                error={errors.name}
              />
              <Input
                label={data.capacity}
                type="number"
                placeholder="e.g., 40"
                value={formData.capacity}
                onChange={(e) => setData('capacity', e.target.value)}
                error={errors.capacity}
              />
            </div>

            <Select
              label={data.teacher}
              options={teacherOptions}
              value={formData.class_teacher_id}
              onChange={(e) => setData('class_teacher_id', e.target.value)}
              error={errors.class_teacher_id}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {data.description}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setData('description', e.target.value)}
                placeholder="Optional"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                variant="primary"
                loading={processing}
              >
                {common.buttons.save}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => window.history.back()}
              >
                {common.buttons.cancel}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ClassesCreate;