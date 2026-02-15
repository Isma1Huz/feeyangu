import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Button } from '@/components/Common/Button';
import { Input } from '@/components/Common/Input';
import { Table } from '@/components/Common/Table';
import { Badge } from '@/components/Common/Badge';
import { Pagination } from '@/components/Common/Pagination';
import { Card } from '@/components/Common/Card';
import { translations } from '@/lib/data';
import { PaginatedResponse, Receipt } from '@/types/index';

interface ParentReceiptsIndexProps {
  receipts: PaginatedResponse<Receipt>;
  filters?: Record<string, any>;
}

const ParentReceiptsIndex: React.FC<ParentReceiptsIndexProps> = ({
  receipts,
  filters = {},
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const data = translations.receipts;
  const common = translations.common;

  const columns = [
    {
      key: 'receipt_number',
      label: data.receiptNo,
    },
    {
      key: 'student_name',
      label: translations.students.singular,
    },
    {
      key: 'amount',
      label: data.amount,
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: 'created_at',
      label: data.date,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'id',
      label: common.labels.actions,
      render: (value: string) => (
        <div className="flex gap-2">
          <Link href={`/parent/receipts/${value}`}>
            <Button variant="ghost" size="sm">
              {common.buttons.view}
            </Button>
          </Link>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              window.location.href = `/parent/receipts/${value}/download`;
            }}
          >
            {data.download}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AppLayout title={data.list}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{data.list}</h1>
          <p className="text-gray-600 mt-1">
            {data.receiptDescription}
          </p>
        </div>

        {/* Filter */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder={`${common.buttons.search} ${data.receiptNo}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="secondary" fullWidth>
              {common.buttons.filter}
            </Button>
            <Button variant="ghost" fullWidth>
              {common.buttons.export}
            </Button>
          </div>
        </Card>

        {/* Table */}
        <Card noPadding>
          <Table
            columns={columns}
            data={receipts.data || []}
            emptyMessage={data.noReceipts}
          />
          <Pagination
            currentPage={receipts.current_page || 1}
            lastPage={receipts.last_page || 1}
            perPage={receipts.per_page || 15}
            total={receipts.total || 0}
            onPageChange={() => {}}
          />
        </Card>

        {/* Info Card */}
        <Card className="bg-blue-50 border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            💡 {data.receiptInfo}
          </h3>
          <p className="text-sm text-blue-800">
            {data.receiptMessage}
          </p>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ParentReceiptsIndex;