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
import { PaginatedResponse, Term } from '@/types/index';

interface TermsIndexProps {
  terms: PaginatedResponse<Term>;
  filters?: Record<string, any>;
  years: number[];
}

const TermsIndex: React.FC<TermsIndexProps> = ({
  terms,
  filters = {},
  years,
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [yearFilter, setYearFilter] = useState(filters.year || '');
  const data = translations.terms;
  const common = translations.common;

  const columns = [
    {
      key: 'name',
      label: data.name,
    },
    {
      key: 'year',
      label: data.year,
    },
    {
      key: 'term_number',
      label: data.termNumber,
    },
    {
      key: 'start_date',
      label: data.startDate,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'end_date',
      label: data.endDate,
      render: (value: string) => new Date(value).toLocaleDateString(),
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
          <Link href={`/school/terms/${value}`}>
            <Button variant="ghost" size="sm">
              {common.buttons.view}
            </Button>
          </Link>
          <Link href={`/school/terms/${value}/edit`}>
            <Button variant="secondary" size="sm">
              {common.buttons.edit}
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  const yearOptions = [
    { value: '', label: `${common.buttons.all} ${data.year}` },
    ...years.map((y) => ({
      value: y.toString(),
      label: y.toString(),
    })),
  ];

  return (
    <AppLayout title={data.list}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">{data.list}</h1>
          <Link href="/school/terms/create">
            <Button variant="primary" size="lg">
              + {data.create}
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder={`${common.buttons.search} ${data.name}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              options={yearOptions}
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
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
            data={terms.data || []}
            emptyMessage={data.noTerms}
          />
          <Pagination
            currentPage={terms.current_page || 1}
            lastPage={terms.last_page || 1}
            perPage={terms.per_page || 15}
            total={terms.total || 0}
            onPageChange={() => {}}
          />
        </Card>
      </div>
    </AppLayout>
  );
};

export default TermsIndex;