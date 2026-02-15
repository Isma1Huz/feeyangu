import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Button } from '@/components/Common/Button';
import { Input } from '@/components/Common/Input';
import { Card } from '@/components/Common/Card';
import { Alert } from '@/components/Common/Alert';
import { translations } from '@/lib/data';

interface ReceiptTemplatesCreateProps {
  defaultHTML: string;
}

const ReceiptTemplatesCreate: React.FC<ReceiptTemplatesCreateProps> = ({
  defaultHTML,
}) => {
  const data = translations.receiptTemplates;
  const common = translations.common;
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const { data: formData, setData, post, processing, errors } = useForm({
    name: '',
    template_html: defaultHTML,
    is_default: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    post('/school/receipt-templates', {
      onSuccess: () => {
        setSubmitSuccess(common.messages.created);
        setTimeout(() => {
          window.location.href = '/school/receipt-templates';
        }, 1500);
      },
      onError: () => {
        setSubmitError(common.messages.error);
      },
    });
  };

  const templateVariables = [
    { key: '{{SCHOOL_NAME}}', label: 'School Name' },
    { key: '{{SCHOOL_ADDRESS}}', label: 'School Address' },
    { key: '{{SCHOOL_PHONE}}', label: 'School Phone' },
    { key: '{{SCHOOL_EMAIL}}', label: 'School Email' },
    { key: '{{RECEIPT_NUMBER}}', label: 'Receipt Number' },
    { key: '{{PAYMENT_DATE}}', label: 'Payment Date' },
    { key: '{{STUDENT_NAME}}', label: 'Student Name' },
    { key: '{{ADMISSION_NO}}', label: 'Admission Number' },
    { key: '{{GRADE}}', label: 'Grade' },
    { key: '{{FEE_BREAKDOWN}}', label: 'Fee Breakdown Items' },
    { key: '{{TOTAL_AMOUNT}}', label: 'Total Amount' },
    { key: '{{AMOUNT_PAID}}', label: 'Amount Paid' },
    { key: '{{BALANCE}}', label: 'Balance' },
    { key: '{{FOOTER_TEXT}}', label: 'Footer Text' },
  ];

  return (
    <AppLayout title={data.create}>
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
          <h1 className="text-2xl font-bold text-gray-800">{data.create}</h1>
          <p className="text-gray-600 mt-1">
            {data.createDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Form */}
          <Card className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label={data.templateName}
                required
                placeholder="e.g., Standard Receipt"
                value={formData.name}
                onChange={(e) => setData('name', e.target.value)}
                error={errors.name}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {data.templateHTML}
                </label>
                <textarea
                  value={formData.template_html}
                  onChange={(e) => setData('template_html', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm"
                  rows={15}
                  placeholder="Enter HTML template..."
                />
                {errors.template_html && (
                  <p className="text-red-600 text-sm mt-2">
                    {errors.template_html}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_default}
                    onChange={(e) => setData('is_default', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {data.setAsDefault}
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
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? common.buttons.hidePreview : common.buttons.preview}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => window.history.back()}
                >
                  {common.buttons.cancel}
                </Button>
              </div>
            </form>
          </Card>

          {/* Variables Reference */}
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {data.availableVariables}
              </h3>
              <div className="space-y-2">
                {templateVariables.map((variable) => (
                  <div
                    key={variable.key}
                    className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => {
                      const textarea = document.querySelector(
                        'textarea'
                      ) as HTMLTextAreaElement;
                      if (textarea) {
                        textarea.value += variable.key;
                        textarea.focus();
                      }
                    }}
                  >
                    <p className="font-mono text-xs text-cyan-600">
                      {variable.key}
                    </p>
                    <p className="text-xs text-gray-600">
                      {variable.label}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-blue-50 border border-blue-200">
              <p className="text-xs text-blue-800">
                💡 Click on any variable to insert it into your template.
              </p>
            </Card>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {common.buttons.preview}
            </h3>
            <iframe
              srcDoc={formData.template_html}
              className="w-full h-[600px] border border-gray-200 rounded-lg"
              title="Template Preview"
            />
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default ReceiptTemplatesCreate;