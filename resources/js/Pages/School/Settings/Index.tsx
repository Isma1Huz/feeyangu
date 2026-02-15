import React, { useState } from 'react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Card } from '@/components/Common/Card';
import { Button } from '@/components/Common/Button';
import { Input } from '@/components/Common/Input';
import { Select } from '@/components/Common/Select';
import { Alert } from '@/components/Common/Alert';
import { translations } from '@/lib/data';
import { useForm } from '@inertiajs/react';

interface SchoolSettingsIndexProps {
  schoolSettings: {
    school_motto: string;
    receipt_footer_text: string;
    primary_color: string;
    secondary_color: string;
    enable_parent_portal: boolean;
    enable_student_portal: boolean;
    require_fee_approval: boolean;
    default_payment_method: string;
    max_upload_size: number;
    receipt_prefix: string;
  };
  school: any;
}

const SchoolSettingsIndex: React.FC<SchoolSettingsIndexProps> = ({
  schoolSettings,
  school,
}) => {
  const data = translations.settings;
  const common = translations.common;
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  const { data: formData, setData, post, processing, errors } = useForm({
    school_motto: schoolSettings.school_motto,
    receipt_footer_text: schoolSettings.receipt_footer_text,
    primary_color: schoolSettings.primary_color,
    secondary_color: schoolSettings.secondary_color,
    enable_parent_portal: schoolSettings.enable_parent_portal,
    enable_student_portal: schoolSettings.enable_student_portal,
    require_fee_approval: schoolSettings.require_fee_approval,
    default_payment_method: schoolSettings.default_payment_method,
    max_upload_size: schoolSettings.max_upload_size,
    receipt_prefix: schoolSettings.receipt_prefix,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    post(`/school/settings`, {
      onSuccess: () => {
        setSubmitSuccess(common.messages.updated);
      },
      onError: () => {
        setSubmitError(common.messages.error);
      },
    });
  };

  const paymentMethods = [
    { value: 'mpesa', label: 'M-Pesa' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card' },
  ];

  const tabs = [
    { id: 'general', label: data.generalSettings },
    { id: 'appearance', label: data.appearanceSettings },
    { id: 'features', label: data.features },
    { id: 'payments', label: data.paymentSettings },
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
            {data.schoolSettings}
          </h1>
          <p className="text-gray-600 mt-1">
            {data.configureSchoolSettings} - {school.name}
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 overflow-x-auto">
          <div className="flex gap-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
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
                  label={data.schoolMotto}
                  value={formData.school_motto}
                  onChange={(e) => setData('school_motto', e.target.value)}
                  error={errors.school_motto}
                  placeholder="e.g., Excellence in Education"
                  helpText={data.schoolMottoHelp}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {data.receiptFooter}
                  </label>
                  <textarea
                    value={formData.receipt_footer_text}
                    onChange={(e) =>
                      setData('receipt_footer_text', e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    rows={3}
                    placeholder="Thank you for your payment..."
                  />
                </div>
                <Input
                  label={data.receiptPrefix}
                  value={formData.receipt_prefix}
                  onChange={(e) => setData('receipt_prefix', e.target.value)}
                  error={errors.receipt_prefix}
                  placeholder="e.g., RCP"
                  helpText={data.receiptPrefixHelp}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {data.primaryColor}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={formData.primary_color || '#06b6d4'}
                        onChange={(e) =>
                          setData('primary_color', e.target.value)
                        }
                        className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.primary_color || '#06b6d4'}
                        onChange={(e) =>
                          setData('primary_color', e.target.value)
                        }
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm"
                        placeholder="#06b6d4"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {data.secondaryColor}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={formData.secondary_color || '#0891b2'}
                        onChange={(e) =>
                          setData('secondary_color', e.target.value)
                        }
                        className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.secondary_color || '#0891b2'}
                        onChange={(e) =>
                          setData('secondary_color', e.target.value)
                        }
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm"
                        placeholder="#0891b2"
                      />
                    </div>
                  </div>
                </div>
                <Card className="bg-blue-50 border border-blue-200">
                  <p className="text-sm text-blue-800">
                    💡 {data.colorPreview}
                  </p>
                </Card>
              </div>
            </Card>
          )}

          {/* Features */}
          {activeTab === 'features' && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {data.features}
              </h2>
              <div className="space-y-4">
                <div className="border border-gray-200 p-4 rounded-lg">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enable_parent_portal}
                      onChange={(e) =>
                        setData('enable_parent_portal', e.target.checked)
                      }
                      className="w-4 h-4 rounded"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {data.enableParentPortal}
                      </p>
                      <p className="text-xs text-gray-600">
                        {data.parentPortalHelp}
                      </p>
                    </div>
                  </label>
                </div>

                <div className="border border-gray-200 p-4 rounded-lg">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enable_student_portal}
                      onChange={(e) =>
                        setData('enable_student_portal', e.target.checked)
                      }
                      className="w-4 h-4 rounded"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {data.enableStudentPortal}
                      </p>
                      <p className="text-xs text-gray-600">
                        {data.studentPortalHelp}
                      </p>
                    </div>
                  </label>
                </div>

                <div className="border border-gray-200 p-4 rounded-lg">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.require_fee_approval}
                      onChange={(e) =>
                        setData('require_fee_approval', e.target.checked)
                      }
                      className="w-4 h-4 rounded"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {data.requireFeeApproval}
                      </p>
                      <p className="text-xs text-gray-600">
                        {data.requireFeeApprovalHelp}
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </Card>
          )}

          {/* Payment Settings */}
          {activeTab === 'payments' && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {data.paymentSettings}
              </h2>
              <div className="space-y-4">
                <Select
                  label={data.defaultPaymentMethod}
                  options={paymentMethods}
                  value={formData.default_payment_method}
                  onChange={(e) =>
                    setData('default_payment_method', e.target.value)
                  }
                  error={errors.default_payment_method}
                />
                <Input
                  label={data.maxUploadSize}
                  type="number"
                  value={formData.max_upload_size}
                  onChange={(e) =>
                    setData('max_upload_size', parseInt(e.target.value))
                  }
                  error={errors.max_upload_size}
                  helpText={data.maxUploadSizeHelp}
                  placeholder="10"
                />
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
            {data.settingsChangeNote}
          </p>
        </Card>
      </div>
    </AppLayout>
  );
};

export default SchoolSettingsIndex;