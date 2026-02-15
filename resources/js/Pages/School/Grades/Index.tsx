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
import { PaginatedResponse, Grade } from '@/types/index';

interface GradesIndexProps {
  grades: PaginatedResponse<Grade>;
  filters?: Record<string, any>;
}

const GradesIndex: React.FC<GradesIndexProps> = ({
  grades,
  filters = {},
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const data = translations.grades;
  const common = translations.common;

  const columns = [
    {
      key: 'name',
      label: data.name,
    },
    {
      key: 'code',
      label: data.code,
    },
    {
      key: 'level',
      label: data.level,
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
          <Link href={`/school/grades/${value}`}>
            <Button variant="ghost" size="sm">
              {common.buttons.view}
            </Button>
          </Link>
          <Link href={`/school/grades/${value}/edit`}>
            <Button variant="secondary" size="sm">
              {common.buttons.edit}
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <AppLayout title={data.list}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">{data.list}</h1>
          <Link href="/school/grades/create">
            <Button variant="primary" size="lg">
              + {data.create}
            </Button>
          </Link>
        </div>

        {/* Filter */}
        <Card>
          <Input
            placeholder={`${common.buttons.search} ${data.name}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Card>

        {/* Table */}
        <Card noPadding>
          <Table
            columns={columns}
            data={grades.data || []}
            emptyMessage={data.noGrades}
          />
          <Pagination
            currentPage={grades.current_page || 1}
            lastPage={grades.last_page || 1}
            perPage={grades.per_page || 15}
            total={grades.total || 0}
            onPageChange={() => {}}
          />
        </Card>
      </div>
    </AppLayout>
  );
};

export default GradesIndex;