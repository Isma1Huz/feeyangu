import React from 'react';
import { Link } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Button } from '@/components/Common/Button';
import { Badge } from '@/components/Common/Badge';
import { Card } from '@/components/Common/Card';
import { StatCard } from '@/components/Common/StatCard';
import { Table } from '@/components/Common/Table';
import { translations } from '@/lib/data';
import { FeeStructure } from '@/types/index';

interface FeeShowProps {
  feeStructure: FeeStructure;
  statistics: any;
}

const FeeShow: React.FC<FeeShowProps> = ({
  feeStructure,
  statistics,
}) => {
  const data = translations.fees;
  const common = translations.common;

  const columns = [
    {
      key: 'item_name',
      label: data.itemName,
    },
    {
      key: 'amount',
      label: data.totalAmount,
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: 'description',
      label: data.description,
    },
  ];

  return (
    <AppLayout title={data.show}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {feeStructure.grade_name} - {feeStructure.term_name}
            </h1>
            <p className="text-gray-600 mt-1">
              Fee structure details
            </p>
          </div>
          <div className="flex gap-3">
            <Link href={`/school/fee-structures/${feeStructure.id}/edit`}>
              <Button variant="secondary">
                {common.buttons.edit}
              </Button>
            </Link>
            <Link href="/school/fee-structures">
              <Button variant="ghost">
                ← {common.buttons.back}
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label={data.assigned}
            value={statistics.assigned}
            backgroundColor="bg-gradient-to-br from-blue-50 to-cyan-50"
          />
          <StatCard
            label={data.collected}
            value={`$${statistics.collected}`}
            backgroundColor="bg-gradient-to-br from-green-50 to-emerald-50"
          />
          <StatCard
            label={data.pending}
            value={`$${statistics.pending}`}
            backgroundColor="bg-gradient-to-br from-orange-50 to-red-50"
          />
        </div>

        {/* Fee Breakdowns */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {data.breakdowns}
          </h3>
          <Table
            columns={columns}
            data={feeStructure.breakdowns || []}
            emptyMessage="No breakdowns"
          />
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold text-gray-800">
                {data.totalAmount}
              </p>
              <p className="text-3xl font-bold text-cyan-600">
                ${feeStructure.total_amount?.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Status */}
        <Card className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-2">{common.labels.status}</p>
            <Badge
              label={feeStructure.is_active ? common.buttons.active : common.buttons.inactive}
              variant={feeStructure.is_active ? 'success' : 'default'}
              size="md"
            />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">{data.dueDate}</p>
            <p className="font-semibold text-gray-800">
              {feeStructure.due_date
                ? new Date(feeStructure.due_date).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default FeeShow;