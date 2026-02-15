import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Button } from '@/components/Common/Button';
import { Input } from '@/components/Common/Input';
import { Select } from '@/components/Common/Select';
import { Table } from '@/components/Common/Table';
import { Badge } from '@/components/Common/Badge';
import { Pagination } from '@/components/Common/Pagination';
import { Card } from '@/components/Common/Card';
import { translations } from '@/lib/data';
import { PaginatedResponse, Payment } from '@/types/index';

interface PaymentsIndexProps {
  payments: PaginatedResponse<Payment>;
  filters?: Record<string, any>;
}

const PaymentsIndex: React.FC<PaymentsIndexProps> = ({
  payments,
  filters = {},
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.payment_status || '');
  const data = translations.payments;
  const common = translations.common;

  const statusOptions = [
    { value: '', label: `${common.buttons.all} ${data.status}` },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Rejected' },
  ];

  const statusMap: any = {
    pending: 'warning',
    approved: 'info',
    completed: 'success',
    rejected: 'danger',
  };

  const columns = [
    {
      key: 'student_name',
      label: translations.students.singular,
    },
    {
      key: 'fee_name',
      label: data.fee,
    },
    {
      key: 'amount',
      label: data.amount,
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: 'payment_method',
      label: data.method,
    },
    {
      key: 'payment_status',
      label: data.status,
      render: (value: string) => (
        <Badge
          label={value.charAt(0).toUpperCase() + value.slice(1)}
          variant={statusMap[value] || 'default'}
        />
      ),
    },
    {
      key: 'id',
      label: common.labels.actions,
      render: (value: string) => (
        <Link href={`/school/payments/${value}`}>
          <Button variant="ghost" size="sm">
            {common.buttons.view}
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <AppLayout title={data.list}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">{data.list}</h1>
          <Link href="/school/payments/create">
            <Button variant="primary" size="lg">
              + {data.create}
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder={`${common.buttons.search}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
            data={payments.data || []}
            emptyMessage={data.noPayments}
          />
          <Pagination
            currentPage={payments.current_page || 1}
            lastPage={payments.last_page || 1}
            perPage={payments.per_page || 15}
            total={payments.total || 0}
            onPageChange={() => {}}
          />
        </Card>
      </div>
    </AppLayout>
  );
};

export default PaymentsIndex;