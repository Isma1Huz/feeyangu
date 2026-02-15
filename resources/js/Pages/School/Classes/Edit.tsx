import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Button } from '@/components/Common/Button';
import { Input } from '@/components/Common/Input';
import { Select } from '@/components/Common/Select';
import { Card } from '@/components/Common/Card';
import { Alert } from '@/components/Common/Alert';
import { translations } from '@/lib/data';
import { SchoolClass } from '@/types/index';

interface ClassesEditProps {
  schoolClass: SchoolClass;
  grade: { id: number; name: string };
  teachers: Array<{ id: number; name: string }>;
}

const ClassesEdit: React.FC<ClassesEditProps> = ({
  schoolClass,
  grade,
  teachers,
}) => {
  const data = translations.classes;
  const common = translations.common;
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: formData, setData, put, processing, errors, delete: destroy } = useForm({
    name: schoolClass.name,
    class_teacher_id: schoolClass.class_teacher_id?.toString() || '',
    capacity: schoolClass.capacity?.toString() || '',
    description: schoolClass.description || '',
    is_active: schoolClass.is_active,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    put(`/school/grades/${grade.id}/classes/${schoolClass.id}`, {
      onSuccess: () => {
        setSubmitSuccess(common.messages.updated);
      },
      onError: () => {
        setSubmitError(common.messages.error);
      },
    });
  };

  const handleDelete = () => {
    destroy(`/school/grades/${grade.id}/classes/${schoolClass.id}`, {
      onSuccess: () => {
        setSubmitSuccess(common.messages.deleted);
        setTimeout(() => {
          window.location.href = `/school/grades/${grade.id}/classes`;
        }, 1500);
      },
      onError: () => {
        setSubmitError(common.messages.error);
        setShowDeleteConfirm(false);
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
    <AppLayout title={data.edit}>
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
                value={formData.name}
                onChange={(e) => setData('name', e.target.value)}
                error={errors.name}
              />
              <Input
                label={data.capacity}
                type="number"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                rows={3}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setData('is_active', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-700">
                  {common.labels.status}
                </span>
              </label>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-200">
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
              <Button
                type="button"
                variant="danger"
                onClick={() => setShowDeleteConfirm(true)}
                className="ml-auto"
              >
                {common.buttons.delete}
              </Button>
            </div>
          </form>
        </Card>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <Card className="border-red-200 bg-red-50">
            <div className="space-y-4">
              <p className="text-red-800 font-medium">
                ⚠️ {common.messages.confirm}
              </p>
              <p className="text-sm text-red-700">
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  loading={processing}
                >
                  {common.buttons.confirm}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  {common.buttons.cancel}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default ClassesEdit;