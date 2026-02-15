import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Button } from '@/components/Common/Button';
import { Input } from '@/components/Common/Input';
import { Select } from '@/components/Common/Select';
import { Card } from '@/components/Common/Card';
import { Alert } from '@/components/Common/Alert';
import { translations } from '@/lib/data';

const PaymentMethodsCreate = () => {
  const data = translations.paymentMethods;
  const common = translations.common;
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [methodType, setMethodType] = useState('');

  const methodTypeOptions = [
    { value: 'mpesa', label: 'M-Pesa' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'bank_check', label: 'Check' },
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card' },
    { value: 'paypal', label: 'PayPal' },
  ];

  const { data: formData, setData, post, processing, errors } = useForm({
    method_type: '',
    account_holder_name: '',
    account_number: '',
    bank_name: '',
    mpesa_number: '',
    is_active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    post('/school/payment-methods', {
      onSuccess: () => {
        setSubmitSuccess(common.messages.created);
        setTimeout(() => {
          window.location.href = '/school/payment-methods';
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
            <Select
              label={data.methodType}
              required
              options={methodTypeOptions}
              value={formData.method_type}
              onChange={(e) => {
                setData('method_type', e.target.value);
                setMethodType(e.target.value);
              }}
              error={errors.method_type}
            />

            {/* M-Pesa Fields */}
            {methodType === 'mpesa' && (
              <Input
                label={data.mpesaNumber}
                value={formData.mpesa_number}
                onChange={(e) => setData('mpesa_number', e.target.value)}
                error={errors.mpesa_number}
              />
            )}

            {/* Bank Fields */}
            {(methodType === 'bank_transfer' || methodType === 'bank_check') && (
              <>
                <Input
                  label={data.bankName}
                  value={formData.bank_name}
                  onChange={(e) => setData('bank_name', e.target.value)}
                  error={errors.bank_name}
                />
                <Input
                  label={data.accountHolderName}
                  value={formData.account_holder_name}
                  onChange={(e) => setData('account_holder_name', e.target.value)}
                  error={errors.account_holder_name}
                />
                <Input
                  label={data.accountNumber}
                  value={formData.account_number}
                  onChange={(e) => setData('account_number', e.target.value)}
                  error={errors.account_number}
                />
              </>
            )}

            {/* Generic Account Fields */}
            {(methodType === 'card' || methodType === 'paypal') && (
              <Input
                label={data.accountHolderName}
                value={formData.account_holder_name}
                onChange={(e) => setData('account_holder_name', e.target.value)}
                error={errors.account_holder_name}
              />
            )}

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

export default PaymentMethodsCreate;