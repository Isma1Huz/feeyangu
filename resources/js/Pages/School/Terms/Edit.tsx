import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Button } from '@/components/Common/Button';
import { Input } from '@/components/Common/Input';
import { Select } from '@/components/Common/Select';
import { Card } from '@/components/Common/Card';
import { Alert } from '@/components/Common/Alert';
import { translations } from '@/lib/data';
import { Term } from '@/types/index';

interface TermsEditProps {
  term: Term;
}

const TermsEdit: React.FC<TermsEditProps> = ({ term }) => {
  const data = translations.terms;
  const common = translations.common;
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const { data: formData, setData, put, processing, errors, delete: destroy } = useForm({
    name: term.name,
    year: term.year.toString(),
    term_number: term.term_number.toString(),
    start_date: term.start_date,
    end_date: term.end_date,
    is_active: term.is_active,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    put(`/school/terms/${term.id}`, {
      onSuccess: () => {
        setSubmitSuccess(common.messages.updated);
      },
      onError: () => {
        setSubmitError(common.messages.error);
      },
    });
  };

  const handleDelete = () => {
    destroy(`/school/terms/${term.id}`, {
      onSuccess: () => {
        setSubmitSuccess(common.messages.deleted);
        setTimeout(() => {
          window.location.href = '/school/terms';
        }, 1500);
      },
      onError: () => {
        setSubmitError(common.messages.error);
        setShowDeleteConfirm(false);
      },
    });
  };

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label={data.name}
                required
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

export default TermsEdit;