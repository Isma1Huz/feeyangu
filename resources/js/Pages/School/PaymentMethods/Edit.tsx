import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Button } from '@/components/Common/Button';
import { Input } from '@/components/Common/Input';
import { Card } from '@/components/Common/Card';
import { Alert } from '@/components/Common/Alert';
import { translations } from '@/lib/data';

interface PaymentMethodsEditProps {
  paymentMethod: {
    id: number;
    method_type: string;
    account_holder_name?: string;
    account_number?: string;
    bank_name?: string;
    mpesa_number?: string;
    is_active: boolean;
  };
}

const PaymentMethodsEdit: React.FC<PaymentMethodsEditProps> = ({
  paymentMethod,
}) => {
  const data = translations.paymentMethods;
  const common = translations.common;
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: formData, setData, put, processing, errors, delete: destroy } = useForm({
    account_holder_name: paymentMethod.account_holder_name || '',
    account_number: paymentMethod.account_number || '',
    bank_name: paymentMethod.bank_name || '',
    mpesa_number: paymentMethod.mpesa_number || '',
    is_active: paymentMethod.is_active,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    put(`/school/payment-methods/${paymentMethod.id}`, {
      onSuccess: () => {
        setSubmitSuccess(common.messages.updated);
      },
      onError: () => {
        setSubmitError(common.messages.error);
      },
    });
  };

  const handleDelete = () => {
    destroy(`/school/payment-methods/${paymentMethod.id}`, {
      onSuccess: () => {
        setSubmitSuccess(common.messages.deleted);
        setTimeout(() => {
          window.location.href = '/school/payment-methods';
        }, 1500);
      },
      onError: () => {
        setSubmitError(common.messages.error);
        setShowDeleteConfirm(false);
      },
    });
  };

  const methodTypeLabels: Record<string, string> = {
    mpesa: 'M-Pesa',
    bank_transfer: 'Bank Transfer',
    bank_check: 'Check',
    cash: 'Cash',
    card: 'Card',
    paypal: 'PayPal',
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
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Method Type</p>
              <p className="font-semibold text-gray-800">
                {methodTypeLabels[paymentMethod.method_type]}
              </p>
            </div>

            {/* M-Pesa Fields */}
            {paymentMethod.method_type === 'mpesa' && (
              <Input
                label={data.mpesaNumber}
                value={formData.mpesa_number}
                onChange={(e) => setData('mpesa_number', e.target.value)}
                error={errors.mpesa_number}
              />
            )}

            {/* Bank Fields */}
            {(paymentMethod.method_type === 'bank_transfer' ||
              paymentMethod.method_type === 'bank_check') && (
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
            {(paymentMethod.method_type === 'card' ||
              paymentMethod.method_type === 'paypal') && (
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

export default PaymentMethodsEdit;