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
import { PaginatedResponse, FeeStructure } from '@/types/index';

interface FeeStructuresIndexProps {
  feeStructures: PaginatedResponse<FeeStructure>;
  filters?: Record<string, any>;
  grades: Array<{ id: number; name: string }>;
  terms: Array<{ id: number; name: string }>;
}

const FeeStructuresIndex: React.FC<FeeStructuresIndexProps> = ({
  feeStructures,
  filters = {},
  grades,
  terms,
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [gradeFilter, setGradeFilter] = useState(filters.grade_id || '');
  const [termFilter, setTermFilter] = useState(filters.term_id || '');
  const data = translations.fees;
  const common = translations.common;

  const columns = [
    {
      key: 'grade_name',
      label: data.grade,
    },
    {
      key: 'term_name',
      label: data.term,
    },
    {
      key: 'total_amount',
      label: data.totalAmount,
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: 'due_date',
      label: data.dueDate,
    },
    {
      key: 'is_active',
      label: common.labels.status,
      render: (value: boolean) => (
        <Badge
          label={value ? common.buttons.active : common.buttons.inactive}
          variant={value ? 'success' : 'default'}
        />
      ),
    },
    {
      key: 'id',
      label: common.labels.actions,
      render: (value: string) => (
        <div className="flex gap-2">
          <Link href={`/school/fee-structures/${value}`}>
            <Button variant="ghost" size="sm">
              {common.buttons.view}
            </Button>
          </Link>
          <Link href={`/school/fee-structures/${value}/edit`}>
            <Button variant="secondary" size="sm">
              {common.buttons.edit}
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  const gradeOptions = [
    { value: '', label: `${common.buttons.all} ${data.grade}` },
    ...grades.map((g) => ({
      value: g.id.toString(),
      label: g.name,
    })),
  ];

  const termOptions = [
    { value: '', label: `${common.buttons.all} ${data.term}` },
    ...terms.map((t) => ({
      value: t.id.toString(),
      label: t.name,
    })),
  ];

  return (
    <AppLayout title={data.list}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">{data.list}</h1>
          <Link href="/school/fee-structures/create">
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
              options={gradeOptions}
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
            />
            <Select
              options={termOptions}
              value={termFilter}
              onChange={(e) => setTermFilter(e.target.value)}
            />
            <Button variant="secondary" fullWidth>
              {common.buttons.filter}
            </Button>
          </div>
        </Card>

        {/* Table */}
        <Card noPadding>
          <Table
            columns={columns}
            data={feeStructures.data || []}
            emptyMessage={data.noFees}
          />
          <Pagination
            currentPage={feeStructures.current_page || 1}
            lastPage={feeStructures.last_page || 1}
            perPage={feeStructures.per_page || 15}
            total={feeStructures.total || 0}
            onPageChange={() => {}}
          />
        </Card>
      </div>
    </AppLayout>
  );
};

export default FeeStructuresIndex;