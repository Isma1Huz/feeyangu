import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Button } from '@/components/Common/Button';
import { Input } from '@/components/Common/Input';
import { Select } from '@/components/Common/Select';
import { Card } from '@/components/Common/Card';
import { Alert } from '@/components/Common/Alert';
import { translations } from '@/lib/data';
import { School } from '@/types/index';

interface SchoolsEditProps {
  school: School;
  themes: Array<{ id: number; name: string }>;
}

const SchoolsEdit: React.FC<SchoolsEditProps> = ({ school, themes }) => {
  const data = translations.schools;
  const common = translations.common;
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: formData, setData, put, processing, errors, delete: destroy } = useForm({
    name: school.name,
    address: school.address || '',
    phone: school.phone || '',
    email: school.email || '',
    logo_path: school.logo_path || '',
    theme_id: school.theme_id?.toString() || '',
    subscription_status: school.subscription_status,
    is_active: school.is_active,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    put(`/admin/schools/${school.id}`, {
      onSuccess: () => {
        setSubmitSuccess(common.messages.updated);
      },
      onError: () => {
        setSubmitError(common.messages.error);
      },
    });
  };

  const handleDelete = () => {
    destroy(`/admin/schools/${school.id}`, {
      onSuccess: () => {
        setSubmitSuccess(common.messages.deleted);
        setTimeout(() => {
          window.location.href = '/admin/schools';
        }, 1500);
      },
      onError: () => {
        setSubmitError(common.messages.error);
        setShowDeleteConfirm(false);
      },
    });
  };

  const themeOptions = [
    { value: '', label: 'Default Theme' },
    ...themes.map((t) => ({
      value: t.id.toString(),
      label: t.name,
    })),
  ];

  const subscriptionOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' },
  ];

  return (
    <AppLayout title={data.edit}>
      <div className="max-w-4xl mx-auto space-y-6">
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
            {/* School Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {data.schoolInformation}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={data.schoolName}
                  required
                  value={formData.name}
                  onChange={(e) => setData('name', e.target.value)}
                  error={errors.name}
                />
                <Input
                  label={data.email}
                  type="email"
                  value={formData.email}
                  onChange={(e) => setData('email', e.target.value)}
                  error={errors.email}
                />
                <Input
                  label={data.phone}
                  value={formData.phone}
                  onChange={(e) => setData('phone', e.target.value)}
                  error={errors.phone}
                />
                <Input
                  label={data.address}
                  value={formData.address}
                  onChange={(e) => setData('address', e.target.value)}
                  error={errors.address}
                />
              </div>
            </div>

            {/* Customization */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {data.customization}
              </h3>
              <Select
                label={data.selectTheme}
                options={themeOptions}
                value={formData.theme_id}
                onChange={(e) => setData('theme_id', e.target.value)}
                error={errors.theme_id}
              />
            </div>

            {/* Subscription & Status */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {data.subscriptionStatus}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label={data.subscription}
                  required
                  options={subscriptionOptions}
                  value={formData.subscription_status}
                  onChange={(e) => setData('subscription_status', e.target.value)}
                  error={errors.subscription_status}
                />
              </div>
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
                ⚠️ {common.messages.confirm}
              </p>
              <p className="text-sm text-red-700">
                This action cannot be undone. All school data will be deleted.
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

export default SchoolsEdit;