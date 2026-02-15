import React, { useState } from 'react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Card } from '@/components/Common/Card';
import { Button } from '@/components/Common/Button';
import { Input } from '@/components/Common/Input';
import { Select } from '@/components/Common/Select';
import { Alert } from '@/components/Common/Alert';
import { translations } from '@/lib/data';
import { useForm } from '@inertiajs/react';

interface AdminSettingsIndexProps {
  settings: {
    app_name: string;
    app_url: string;
    app_description: string;
    support_email: string;
    support_phone: string;
    default_currency: string;
    timezone: string;
    language: string;
    terms_url: string;
    privacy_url: string;
    logo_url: string;
    favicon_url: string;
    maintenance_mode: boolean;
  };
}

const AdminSettingsIndex: React.FC<AdminSettingsIndexProps> = ({ settings }) => {
  const data = translations.settings;
  const common = translations.common;
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  const { data: formData, setData, post, processing, errors } = useForm({
    app_name: settings.app_name,
    app_url: settings.app_url,
    app_description: settings.app_description,
    support_email: settings.support_email,
    support_phone: settings.support_phone,
    default_currency: settings.default_currency,
    timezone: settings.timezone,
    language: settings.language,
    terms_url: settings.terms_url,
    privacy_url: settings.privacy_url,
    logo_url: settings.logo_url,
    favicon_url: settings.favicon_url,
    maintenance_mode: settings.maintenance_mode,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    post('/admin/settings', {
      onSuccess: () => {
        setSubmitSuccess(common.messages.updated);
      },
      onError: () => {
        setSubmitError(common.messages.error);
      },
    });
  };

  const currencyOptions = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'KES', label: 'Kenyan Shilling (KSh)' },
    { value: 'NGN', label: 'Nigerian Naira (₦)' },
    { value: 'ZAR', label: 'South African Rand (R)' },
  ];

  const timezoneOptions = [
    { value: 'UTC', label: 'UTC' },
    { value: 'Africa/Nairobi', label: 'Africa/Nairobi' },
    { value: 'Africa/Lagos', label: 'Africa/Lagos' },
    { value: 'Africa/Johannesburg', label: 'Africa/Johannesburg' },
    { value: 'America/New_York', label: 'America/New_York' },
    { value: 'Europe/London', label: 'Europe/London' },
    { value: 'Asia/Dubai', label: 'Asia/Dubai' },
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'sw', label: 'Swahili' },
  ];

  const tabs = [
    { id: 'general', label: data.generalSettings },
    { id: 'appearance', label: data.appearanceSettings },
    { id: 'support', label: data.supportSettings },
    { id: 'legal', label: data.legalSettings },
    { id: 'maintenance', label: data.maintenance },
  ];

  return (
    <AppLayout title={data.settings}>
      <div className="space-y-6">
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

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {data.settings}
          </h1>
          <p className="text-gray-600 mt-1">
            {data.settingsDescription}
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 overflow-x-auto">
          <div className="flex gap-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-cyan-500 text-cyan-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {data.generalSettings}
              </h2>
              <div className="space-y-4">
                <Input
                  label={data.appName}
                  required
                  value={formData.app_name}
                  onChange={(e) => setData('app_name', e.target.value)}
                  error={errors.app_name}
                />
                <Input
                  label={data.appUrl}
                  required
                  value={formData.app_url}
                  onChange={(e) => setData('app_url', e.target.value)}
                  error={errors.app_url}
                  helpText={data.appUrlHelp}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {data.appDescription}
                  </label>
                  <textarea
                    value={formData.app_description}
                    onChange={(e) => setData('app_description', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    rows={4}
                    placeholder="Platform description for marketing..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label={data.defaultCurrency}
                    options={currencyOptions}
                    value={formData.default_currency}
                    onChange={(e) => setData('default_currency', e.target.value)}
                    error={errors.default_currency}
                  />
                  <Select
                    label={data.timezone}
                    options={timezoneOptions}
                    value={formData.timezone}
                    onChange={(e) => setData('timezone', e.target.value)}
                    error={errors.timezone}
                  />
                </div>
                <Select
                  label={data.language}
                  options={languageOptions}
                  value={formData.language}
                  onChange={(e) => setData('language', e.target.value)}
                  error={errors.language}
                />
              </div>
            </Card>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {data.appearanceSettings}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {data.logoUrl}
                  </label>
                  <Input
                    type="url"
                    value={formData.logo_url}
                    onChange={(e) => setData('logo_url', e.target.value)}
                    error={errors.logo_url}
                    placeholder="https://example.com/logo.png"
                  />
                  {formData.logo_url && (
                    <div className="mt-4">
                      <img
                        src={formData.logo_url}
                        alt="Logo Preview"
                        className="h-20 object-contain"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {data.faviconUrl}
                  </label>
                  <Input
                    type="url"
                    value={formData.favicon_url}
                    onChange={(e) => setData('favicon_url', e.target.value)}
                    error={errors.favicon_url}
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Support Settings */}
          {activeTab === 'support' && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {data.supportSettings}
              </h2>
              <div className="space-y-4">
                <Input
                  label={data.supportEmail}
                  type="email"
                  required
                  value={formData.support_email}
                  onChange={(e) => setData('support_email', e.target.value)}
                  error={errors.support_email}
                  placeholder="support@example.com"
                />
                <Input
                  label={data.supportPhone}
                  value={formData.support_phone}
                  onChange={(e) => setData('support_phone', e.target.value)}
                  error={errors.support_phone}
                  placeholder="+1 (555) 000-0000"
                />
                <Card className="bg-blue-50 border border-blue-200">
                  <p className="text-sm text-blue-800">
                    💡 {data.supportContactInfo}
                  </p>
                </Card>
              </div>
            </Card>
          )}

          {/* Legal Settings */}
          {activeTab === 'legal' && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {data.legalSettings}
              </h2>
              <div className="space-y-4">
                <Input
                  label={data.termsUrl}
                  type="url"
                  value={formData.terms_url}
                  onChange={(e) => setData('terms_url', e.target.value)}
                  error={errors.terms_url}
                  placeholder="https://example.com/terms"
                  helpText={data.termsUrlHelp}
                />
                <Input
                  label={data.privacyUrl}
                  type="url"
                  value={formData.privacy_url}
                  onChange={(e) => setData('privacy_url', e.target.value)}
                  error={errors.privacy_url}
                  placeholder="https://example.com/privacy"
                  helpText={data.privacyUrlHelp}
                />
              </div>
            </Card>
          )}

          {/* Maintenance */}
          {activeTab === 'maintenance' && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {data.maintenance}
              </h2>
              <div className="space-y-4">
                <div className="border-2 border-yellow-200 bg-yellow-50 p-6 rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">⚠️</div>
                    <div>
                      <h3 className="font-semibold text-yellow-900 mb-2">
                        {data.maintenanceMode}
                      </h3>
                      <p className="text-sm text-yellow-800 mb-4">
                        {data.maintenanceModeDescription}
                      </p>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.maintenance_mode}
                          onChange={(e) =>
                            setData('maintenance_mode', e.target.checked)
                          }
                          className="w-5 h-5 rounded"
                        />
                        <span className="text-sm font-medium text-yellow-900">
                          {data.enableMaintenanceMode}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
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
              onClick={() => window.location.reload()}
            >
              {common.buttons.reset}
            </Button>
          </div>
        </form>

        {/* Info Card */}
        <Card className="bg-blue-50 border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            💡 {data.note}
          </h3>
          <p className="text-sm text-blue-800">
            {data.settingsNote}
          </p>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AdminSettingsIndex;