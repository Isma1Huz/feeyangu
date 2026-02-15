import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Button } from '@/components/Common/Button';
import { Input } from '@/components/Common/Input';
import { Select } from '@/components/Common/Select';
import { Card } from '@/components/Common/Card';
import { Alert } from '@/components/Common/Alert';
import { StatCard } from '@/components/Common/StatCard';
import { translations } from '@/lib/data';

interface ParentPaymentCreateProps {
  students: Array<{ id: number; full_name: string }>;
  studentFees: Array<{
    id: number;
    student_id: number;
    fee_name: string;
    balance: number;
  }>;
  paymentMethods: Array<{ value: string; label: string }>;
}

const ParentPaymentCreate: React.FC<ParentPaymentCreateProps> = ({
  students,
  studentFees,
  paymentMethods,
}) => {
  const data = translations.payments;
  const common = translations.common;
  const studentData = translations.students;
  const [selectedStudent, setSelectedStudent] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const { data: formData, setData, post, processing, errors } = useForm({
    student_fee_id: '',
    amount: '',
    payment_method: '',
    reference: '',
    notes: '',
  });

  const filteredFees = selectedStudent
    ? studentFees.filter((f) => f.student_id === parseInt(selectedStudent))
    : [];

  const selectedFee = filteredFees.find(
    (f) => f.id === parseInt(formData.student_fee_id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    post('/parent/payments', {
      onSuccess: () => {
        setSubmitSuccess(common.messages.created);
        setTimeout(() => {
          window.location.href = '/parent/payments/confirmation';
        }, 1500);
      },
      onError: () => {
        setSubmitError(common.messages.error);
      },
    });
  };

  const studentOptions = students.map((s) => ({
    value: s.id.toString(),
    label: s.full_name,
  }));

  const feeOptions = filteredFees.map((f) => ({
    value: f.id.toString(),
    label: `${f.fee_name} - Balance: $${f.balance}`,
  }));

  return (
    <AppLayout title={data.create}>
      <div className="max-w-3xl mx-auto space-y-6">
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
            {data.makePay}
          </h1>
          <p className="text-gray-600 mt-1">
            {data.fillPaymentDetails}
          </p>
        </div>

        {/* Payment Form */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Student Selection */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                1. {data.selectStudent}
              </h3>
              <Select
                label={`${common.buttons.select} ${studentData.singular}`}
                required
                options={studentOptions}
                value={selectedStudent}
                onChange={(e) => {
                  setSelectedStudent(e.target.value);
                  setData('student_fee_id', '');
                }}
              />
            </div>

            {/* Step 2: Fee Selection */}
            {selectedStudent && (
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  2. {data.selectFee}
                </h3>
                <Select
                  label={data.fee}
                  required
                  options={feeOptions}
                  value={formData.student_fee_id}
                  onChange={(e) => setData('student_fee_id', e.target.value)}
                  error={errors.student_fee_id}
                />
              </div>
            )}

            {/* Fee Summary */}
            {selectedFee && (
              <Card className="bg-cyan-50 border border-cyan-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {data.feeSummary}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatCard
                    label="Fee Name"
                    value={selectedFee.fee_name}
                    backgroundColor="bg-white"
                  />
                  <StatCard
                    label="Outstanding Balance"
                    value={`$${selectedFee.balance.toLocaleString()}`}
                    backgroundColor="bg-white"
                  />
                </div>
              </Card>
            )}

            {/* Step 3: Payment Amount & Method */}
            {formData.student_fee_id && (
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  3. {data.paymentDetails}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label={data.amount}
                    type="number"
                    placeholder="0.00"
                    required
                    value={formData.amount}
                    onChange={(e) => setData('amount', e.target.value)}
                    error={errors.amount}
                    helpText={`Max: $${selectedFee?.balance}`}
                  />
                  <Select
                    label={data.method}
                    required
                    options={paymentMethods}
                    value={formData.payment_method}
                    onChange={(e) => setData('payment_method', e.target.value)}
                    error={errors.payment_method}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Payment Reference */}
            {formData.student_fee_id && (
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  4. {data.referenceInfo}
                </h3>
                <Input
                  label={data.reference}
                  placeholder={data.referencePlaceholder}
                  required
                  value={formData.reference}
                  onChange={(e) => setData('reference', e.target.value)}
                  error={errors.reference}
                  helpText={data.referenceHelp}
                />
              </div>
            )}

            {/* Optional Notes */}
            {formData.student_fee_id && (
              <div className="pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  5. {common.labels.notes}
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {data.additionalInfo}
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    placeholder="Optional - e.g., Payment for Term 1 school fees"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Confirmation Message */}
            {formData.student_fee_id && (
              <Card className="bg-blue-50 border border-blue-200">
                <p className="text-sm text-blue-800">
                  ✓ {data.confirmationMessage}
                </p>
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <Button
                type="submit"
                variant="primary"
                loading={processing}
                disabled={!formData.student_fee_id || !formData.amount}
              >
                {data.submit}
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

        {/* Security Notice */}
        <Card className="bg-gray-50 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            🔒 {data.securityNotice}
          </h3>
          <p className="text-xs text-gray-600">
            {data.securityMessage}
          </p>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ParentPaymentCreate;