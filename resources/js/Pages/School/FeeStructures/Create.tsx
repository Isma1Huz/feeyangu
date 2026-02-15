import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Button } from '@/components/Common/Button';
import { Input } from '@/components/Common/Input';
import { Select } from '@/components/Common/Select';
import { Card } from '@/components/Common/Card';
import { Alert } from '@/components/Common/Alert';
import { translations } from '@/lib/data';
import { FeeBreakdown } from '@/types/index';

interface FeeStructuresCreateProps {
  grades: Array<{ id: number; name: string }>;
  terms: Array<{ id: number; name: string }>;
}

const FeeStructuresCreate: React.FC<FeeStructuresCreateProps> = ({
  grades,
  terms,
}) => {
  const data = translations.fees;
  const common = translations.common;
  const [breakdowns, setBreakdowns] = useState<FeeBreakdown[]>([
    { item_name: '', amount: 0, description: '' },
  ]);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const { data: formData, setData, post, processing, errors } = useForm({
    grade_id: '',
    term_id: '',
    due_date: '',
    breakdowns: breakdowns,
  });

  const handleBreakdownChange = (
    index: number,
    field: keyof FeeBreakdown,
    value: any
  ) => {
    const newBreakdowns = [...breakdowns];
    newBreakdowns[index] = {
      ...newBreakdowns[index],
      [field]: value,
    };
    setBreakdowns(newBreakdowns);
    setData('breakdowns', newBreakdowns);
  };

  const addBreakdown = () => {
    setBreakdowns([
      ...breakdowns,
      { item_name: '', amount: 0, description: '' },
    ]);
  };

  const removeBreakdown = (index: number) => {
    const newBreakdowns = breakdowns.filter((_, i) => i !== index);
    setBreakdowns(newBreakdowns);
    setData('breakdowns', newBreakdowns);
  };

  const totalAmount = breakdowns.reduce((sum, b) => sum + (b.amount || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    post('/school/fee-structures', {
      onSuccess: () => {
        setSubmitSuccess(common.messages.created);
      },
      onError: () => {
        setSubmitError(common.messages.error);
      },
    });
  };

  const gradeOptions = grades.map((g) => ({
    value: g.id.toString(),
    label: g.name,
  }));

  const termOptions = terms.map((t) => ({
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
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {common.labels.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label={data.grade}
                  required
                  options={gradeOptions}
                  value={formData.grade_id}
                  onChange={(e) => setData('grade_id', e.target.value)}
                  error={errors.grade_id}
                />
                <Select
                  label={data.term}
                  required
                  options={termOptions}
                  value={formData.term_id}
                  onChange={(e) => setData('term_id', e.target.value)}
                  error={errors.term_id}
                />
                <Input
                  label={data.dueDate}
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setData('due_date', e.target.value)}
                  error={errors.due_date}
                />
              </div>
            </div>

            {/* Breakdowns */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {data.breakdowns}
                </h3>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={addBreakdown}
                >
                  + {data.addBreakdown}
                </Button>
              </div>

              <div className="space-y-3">
                {breakdowns.map((breakdown, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Input
                        label={data.itemName}
                        placeholder="e.g., Tuition"
                        required
                        value={breakdown.item_name}
                        onChange={(e) =>
                          handleBreakdownChange(
                            index,
                            'item_name',
                            e.target.value
                          )
                        }
                      />
                      <Input
                        label={data.totalAmount}
                        type="number"
                        placeholder="0.00"
                        required
                        value={breakdown.amount}
                        onChange={(e) =>
                          handleBreakdownChange(
                            index,
                            'amount',
                            parseFloat(e.target.value) || 0
                          )
                        }
                      />
                      <Input
                        label={data.description}
                        placeholder="Optional"
                        value={breakdown.description}
                        onChange={(e) =>
                          handleBreakdownChange(
                            index,
                            'description',
                            e.target.value
                          )
                        }
                      />
                      <div className="flex items-end">
                        {breakdowns.length > 1 && (
                          <Button
                            type="button"
                            variant="danger"
                            fullWidth
                            onClick={() => removeBreakdown(index)}
                          >
                            {data.removeBreakdown}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Total */}
              <div className="mt-6 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                <p className="text-sm text-gray-600 mb-1">
                  {data.totalAmount}
                </p>
                <p className="text-3xl font-bold text-cyan-600">
                  ${totalAmount.toLocaleString()}
                </p>
              </div>
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

export default FeeStructuresCreate;