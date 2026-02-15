import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Button } from '@/components/Common/Button';
import { Input } from '@/components/Common/Input';
import { Select } from '@/components/Common/Select';
import { Card } from '@/components/Common/Card';
import { Alert } from '@/components/Common/Alert';
import { translations } from '@/lib/data';

const TermsCreate = () => {
  const data = translations.terms;
  const common = translations.common;
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => ({
    value: (currentYear + i - 2).toString(),
    label: (currentYear + i - 2).toString(),
  }));

  const termNumbers = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
  ];

  const { data: formData, setData, post, processing, errors } = useForm({
    name: '',
    year: currentYear.toString(),
    term_number: '1',
    start_date: '',
    end_date: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    post('/school/terms', {
      onSuccess: () => {
        setSubmitSuccess(common.messages.created);
        setTimeout(() => {
          window.location.href = '/school/terms';
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label={data.name}
                required
                placeholder="e.g., Term 1"
                value={formData.name}
                onChange={(e) => setData('name', e.target.value)}
                error={errors.name}
              />
              <Select
                label={data.year}
                required
                options={years}
                value={formData.year}
                onChange={(e) => setData('year', e.target.value)}
                error={errors.year}
              />
              <Select
                label={data.termNumber}
                required
                options={termNumbers}
                value={formData.term_number}
                onChange={(e) => setData('term_number', e.target.value)}
                error={errors.term_number}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={data.startDate}
                type="date"
                required
                value={formData.start_date}
                onChange={(e) => setData('start_date', e.target.value)}
                error={errors.start_date}
              />
              <Input
                label={data.endDate}
                type="date"
                required
                value={formData.end_date}
                onChange={(e) => setData('end_date', e.target.value)}
                error={errors.end_date}
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

export default TermsCreate;