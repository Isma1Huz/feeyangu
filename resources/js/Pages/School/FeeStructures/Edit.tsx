import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Button } from '@/components/Common/Button';
import { Input } from '@/components/Common/Input';
import { Select } from '@/components/Common/Select';
import { Card } from '@/components/Common/Card';
import { Alert } from '@/components/Common/Alert';
import { translations } from '@/lib/data';
import { FeeStructure, FeeBreakdown } from '@/types/index';

interface FeeStructuresEditProps {
  feeStructure: FeeStructure;
  grades: Array<{ id: number; name: string }>;
  terms: Array<{ id: number; name: string }>;
  statistics: any;
}

const FeeStructuresEdit: React.FC<FeeStructuresEditProps> = ({
  feeStructure,
  grades,
  terms,
  statistics,
}) => {
  const data = translations.fees;
  const common = translations.common;
  const [breakdowns, setBreakdowns] = useState<FeeBreakdown[]>(
    feeStructure.breakdowns || [{ item_name: '', amount: 0, description: '' }]
  );
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: formData, setData, put, processing, errors, delete: destroy } = useForm({
    grade_id: feeStructure.grade_id.toString(),
    term_id: feeStructure.term_id.toString(),
    due_date: feeStructure.due_date || '',
    is_active: feeStructure.is_active,
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

    put(`/school/fee-structures/${feeStructure.id}`, {
      onSuccess: () => {
        setSubmitSuccess(common.messages.updated);
      },
      onError: () => {
        setSubmitError(common.messages.error);
      },
    });
  };

  const handleDelete = () => {
    destroy(`/school/fee-structures/${feeStructure.id}`, {
      onSuccess: () => {
        setSubmitSuccess(common.messages.deleted);
        setTimeout(() => {
          window.location.href = '/school/fee-structures';
        }, 1500);
      },
      onError: () => {
        setSubmitError(common.messages.error);
        setShowDeleteConfirm(false);
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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-sm text-gray-600">Assigned</p>
            <p className="text-2xl font-bold text-cyan-600">
              {statistics?.assigned || 0}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Collected</p>
            <p className="text-2xl font-bold text-green-600">
              ${statistics?.collected || 0}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-orange-600">
              ${statistics?.pending || 0}
            </p>
          </Card>
        </div>

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

            {/* Status */}
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
                            Remove
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

export default FeeStructuresEdit;