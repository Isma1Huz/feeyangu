import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Button } from '@/components/Common/Button';
import { Input } from '@/components/Common/Input';
import { Select } from '@/components/Common/Select';
import { Card } from '@/components/Common/Card';
import { Alert } from '@/components/Common/Alert';
import { translations } from '@/lib/data';

interface PaymentsCreateProps {
  students: Array<{ id: number; full_name: string }>;
  studentFees: Array<{ 
    id: number; 
    student_id: number; 
    fee_name: string; 
    balance: number;
  }>;
  paymentMethods: Array<{ value: string; label: string }>;
}

const PaymentsCreate: React.FC<PaymentsCreateProps> = ({
  students,
  studentFees,
  paymentMethods,
}) => {
  const data = translations.payments;
  const common = translations.common;
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
    ? studentFees.filter(
        (f) => f.student_id === parseInt(selectedStudent)
      )
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    post('/school/payments', {
      onSuccess: () => {
        setSubmitSuccess(common.messages.created);
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
            {/* Student Selection */}
            <div>
              <Select
                label={`${common.buttons.select} ${translations.students.singular}`}
                required
                options={studentOptions}
                value={selectedStudent}
                onChange={(e) => {
                  setSelectedStudent(e.target.value);
                  setData('student_fee_id', '');
                }}
              />
            </div>

            {/* Fee Selection */}
            {selectedStudent && (
              <Select
                label={data.fee}
                required
                options={feeOptions}
                value={formData.student_fee_id}
                onChange={(e) => setData('student_fee_id', e.target.value)}
                error={errors.student_fee_id}
              />
            )}

            {/* Payment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={data.amount}
                type="number"
                placeholder="0.00"
                required
                value={formData.amount}
                onChange={(e) => setData('amount', e.target.value)}
                error={errors.amount}
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

            {/* Reference */}
            <Input
              label={data.reference}
              placeholder="Transaction reference"
              value={formData.reference}
              onChange={(e) => setData('reference', e.target.value)}
              error={errors.reference}
            />

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {common.labels.notes}
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setData('notes', e.target.value)}
                placeholder="Optional"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                rows={3}
              />
            </div>

            {/* Actions */}
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

export default PaymentsCreate;