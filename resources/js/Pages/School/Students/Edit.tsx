import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Button } from '@/components/Common/Button';
import { Input } from '@/components/Common/Input';
import { Select } from '@/components/Common/Select';
import { Card } from '@/components/Common/Card';
import { Alert } from '@/components/Common/Alert';
import { translations } from '@/lib/data';
import { Student } from '@/types';

interface StudentsEditProps {
  student: Student;
  grades: Array<{ id: number; name: string }>;
  parents: Array<{ id: number; name: string }>;
}

const StudentsEdit: React.FC<StudentsEditProps> = ({
  student,
  grades,
  parents,
}) => {
  const data = translations.students;
  const common = translations.common;
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: formData, setData, put, processing, errors, delete: destroy } = useForm({
    admission_no: student.admission_no,
    first_name: student.first_name,
    last_name: student.last_name,
    email: student.email || '',
    grade_id: student.grade_id.toString(),
    parent_id: student.parent_id?.toString() || '',
    date_of_birth: student.date_of_birth || '',
    phone: student.phone || '',
    address: student.address || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    put(`/school/students/${student.id}`, {
      onSuccess: () => {
        setSubmitSuccess(common.messages.updated);
      },
      onError: () => {
        setSubmitError(common.messages.error);
      },
    });
  };

  const handleDelete = () => {
    destroy(`/school/students/${student.id}`, {
      onSuccess: () => {
        setSubmitSuccess(common.messages.deleted);
        setTimeout(() => {
          window.location.href = '/school/students';
        }, 1500);
      },
      onError: () => {
        setSubmitError(common.messages.error);
        setShowDeleteConfirm(false);
      },
    });
  };

  const gradeOptions = grades.map((g) => ({
    value: g.id.toString(),
    label: g.name,
  }));

  const parentOptions = [
    { value: '', label: `${common.buttons.select} ${data.parent}` },
    ...parents.map((p) => ({
      value: p.id.toString(),
      label: p.name,
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
            {/* Personal Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {common.labels.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={data.admissionNo}
                  disabled
                  value={formData.admission_no}
                />
                <Input
                  label={data.firstName}
                  required
                  value={formData.first_name}
                  onChange={(e) => setData('first_name', e.target.value)}
                  error={errors.first_name}
                />
                <Input
                  label={data.lastName}
                  required
                  value={formData.last_name}
                  onChange={(e) => setData('last_name', e.target.value)}
                  error={errors.last_name}
                />
                <Input
                  label={common.labels.email}
                  type="email"
                  value={formData.email}
                  onChange={(e) => setData('email', e.target.value)}
                  error={errors.email}
                />
              </div>
            </div>

            {/* Academic Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {data.grade}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label={data.grade}
                  required
                  options={gradeOptions}
                  value={formData.grade_id}
                  onChange={(e) => setData('grade_id', e.target.value)}
                  error={errors.grade_id}
                />
                <Select
                  label={data.parent}
                  options={parentOptions}
                  value={formData.parent_id}
                  onChange={(e) => setData('parent_id', e.target.value)}
                  error={errors.parent_id}
                />
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {common.labels.phone}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={data.dateOfBirth}
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setData('date_of_birth', e.target.value)}
                  error={errors.date_of_birth}
                />
                <Input
                  label={common.labels.phone}
                  value={formData.phone}
                  onChange={(e) => setData('phone', e.target.value)}
                  error={errors.phone}
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {common.labels.address}
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setData('address', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                rows={3}
              />
            </div>

            {/* Actions */}
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
                ⚠️ {data.confirmDelete}
              </p>
              <p className="text-sm text-red-700">
                {common.messages.confirm}
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

export default StudentsEdit;