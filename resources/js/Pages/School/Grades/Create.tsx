import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Button } from '@/components/Common/Button';
import { Input } from '@/components/Common/Input';
import { Card } from '@/components/Common/Card';
import { Alert } from '@/components/Common/Alert';
import { translations } from '@/lib/data';

const GradesCreate = () => {
  const data = translations.grades;
  const common = translations.common;
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const { data: formData, setData, post, processing, errors } = useForm({
    name: '',
    code: '',
    level: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    post('/school/grades', {
      onSuccess: () => {
        setSubmitSuccess(common.messages.created);
        setTimeout(() => {
          window.location.href = '/school/grades';
        }, 1500);
      },
      onError: () => {
        setSubmitError(common.messages.error);
      },
    });
  };

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={data.name}
                required
                placeholder="e.g., Grade 10"
                value={formData.name}
                onChange={(e) => setData('name', e.target.value)}
                error={errors.name}
              />
              <Input
                label={data.code}
                required
                placeholder="e.g., G10"
                value={formData.code}
                onChange={(e) => setData('code', e.target.value)}
                error={errors.code}
              />
            </div>

            <Input
              label={data.level}
              type="number"
              placeholder="e.g., 10"
              value={formData.level}
              onChange={(e) => setData('level', e.target.value)}
              error={errors.level}
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

export default GradesCreate;