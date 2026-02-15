import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Button } from '@/components/Common/Button';
import { Input } from '@/components/Common/Input';
import { Select } from '@/components/Common/Select';
import { Card } from '@/components/Common/Card';
import { Alert } from '@/components/Common/Alert';
import { translations } from '@/lib/data';

interface StudentsCreateProps {
  grades: Array<{ id: number; name: string }>;
  parents: Array<{ id: number; name: string }>;
}

const StudentsCreate: React.FC<StudentsCreateProps> = ({ grades, parents }) => {
  const data = translations.students;
  const common = translations.common;
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const { data: formData, setData, post, processing, errors } = useForm({
    admission_no: '',
    first_name: '',
    last_name: '',
    email: '',
    grade_id: '',
    parent_id: '',
    date_of_birth: '',
    phone: '',
    address: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    post('/school/students', {
      onSuccess: () => {
        setSubmitSuccess(common.messages.created);
      },
      onError: () => {
        setSubmitError(common.messages.error);
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
            {/* Section Title */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {common.labels.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={data.admissionNo}
                  required
                  value={formData.admission_no}
                  onChange={(e) => setData('admission_no', e.target.value)}
                  error={errors.admission_no}
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

export default StudentsCreate;