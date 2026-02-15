import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Button } from '@/components/Common/Button';
import { Input } from '@/components/Common/Input';
import { Select } from '@/components/Common/Select';
import { Card } from '@/components/Common/Card';
import { Alert } from '@/components/Common/Alert';
import { translations } from '@/lib/data';

interface SchoolsCreateProps {
  themes: Array<{ id: number; name: string }>;
}

const SchoolsCreate: React.FC<SchoolsCreateProps> = ({ themes }) => {
  const data = translations.schools;
  const common = translations.common;
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const { data: formData, setData, post, processing, errors } = useForm({
    name: '',
    address: '',
    phone: '',
    email: '',
    owner_name: '',
    owner_email: '',
    owner_phone: '',
    owner_password: '',
    theme_id: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    post('/admin/schools', {
      onSuccess: () => {
        setSubmitSuccess(common.messages.created);
        setTimeout(() => {
          window.location.href = '/admin/schools';
        }, 1500);
      },
      onError: () => {
        setSubmitError(common.messages.error);
      },
    });
  };

  const themeOptions = themes.map((t) => ({
    value: t.id.toString(),
    label: t.name,
  }));

  return (
    <AppLayout title={data.create}>
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
                  placeholder="e.g., Saint Mary's High School"
                  value={formData.name}
                  onChange={(e) => setData('name', e.target.value)}
                  error={errors.name}
                />
                <Input
                  label={data.email}
                  type="email"
                  placeholder="school@example.com"
                  value={formData.email}
                  onChange={(e) => setData('email', e.target.value)}
                  error={errors.email}
                />
                <Input
                  label={data.phone}
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setData('phone', e.target.value)}
                  error={errors.phone}
                />
                <Input
                  label={data.address}
                  placeholder="123 Main Street, City"
                  value={formData.address}
                  onChange={(e) => setData('address', e.target.value)}
                  error={errors.address}
                />
              </div>
            </div>

            {/* Admin Account */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {data.adminAccount}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={data.ownerName}
                  required
                  placeholder="e.g., John Smith"
                  value={formData.owner_name}
                  onChange={(e) => setData('owner_name', e.target.value)}
                  error={errors.owner_name}
                />
                <Input
                  label={data.ownerEmail}
                  type="email"
                  required
                  placeholder="admin@example.com"
                  value={formData.owner_email}
                  onChange={(e) => setData('owner_email', e.target.value)}
                  error={errors.owner_email}
                />
                <Input
                  label={data.ownerPhone}
                  placeholder="+1 (555) 000-0000"
                  value={formData.owner_phone}
                  onChange={(e) => setData('owner_phone', e.target.value)}
                  error={errors.owner_phone}
                />
                <Input
                  label={data.ownerPassword}
                  type="password"
                  required
                  placeholder="At least 8 characters"
                  value={formData.owner_password}
                  onChange={(e) => setData('owner_password', e.target.value)}
                  error={errors.owner_password}
                  helpText={data.passwordRequirements}
                />
              </div>
            </div>

            {/* Theme */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {data.customization}
              </h3>
              <Select
                label={data.selectTheme}
                options={[
                  { value: '', label: 'Default Theme' },
                  ...themeOptions,
                ]}
                value={formData.theme_id}
                onChange={(e) => setData('theme_id', e.target.value)}
                error={errors.theme_id}
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
            </div>
          </form>
        </Card>

        {/* Info Card */}
        <Card className="bg-blue-50 border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            💡 {data.setupInfo}
          </h3>
          <p className="text-sm text-blue-800">
            {data.setupMessage}
          </p>
        </Card>
      </div>
    </AppLayout>
  );
};

export default SchoolsCreate;