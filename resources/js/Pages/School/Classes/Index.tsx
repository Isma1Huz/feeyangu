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
import { PaginatedResponse, SchoolClass } from '@/types/index';

interface ClassesIndexProps {
  classes: PaginatedResponse<SchoolClass>;
  grade: { id: number; name: string };
  filters?: Record<string, any>;
}

const ClassesIndex: React.FC<ClassesIndexProps> = ({
  classes,
  grade,
  filters = {},
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const data = translations.classes;
  const common = translations.common;

  const columns = [
    {
      key: 'name',
      label: data.name,
    },
    {
      key: 'class_teacher_name',
      label: data.teacher,
    },
    {
      key: 'capacity',
      label: data.capacity,
    },
    {
      key: 'student_count',
      label: 'Students',
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
          <Link href={`/school/grades/${grade.id}/classes/${value}`}>
            <Button variant="ghost" size="sm">
              {common.buttons.view}
            </Button>
          </Link>
          <Link href={`/school/grades/${grade.id}/classes/${value}/edit`}>
            <Button variant="secondary" size="sm">
              {common.buttons.edit}
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <AppLayout title={`${data.list} - ${grade.name}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {data.list} - {grade.name}
            </h1>
          </div>
          <Link href={`/school/grades/${grade.id}/classes/create`}>
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
            data={classes.data || []}
            emptyMessage={data.noClasses}
          />
          <Pagination
            currentPage={classes.current_page || 1}
            lastPage={classes.last_page || 1}
            perPage={classes.per_page || 15}
            total={classes.total || 0}
            onPageChange={() => {}}
          />
        </Card>

        {/* Back */}
        <Link href="/school/grades">
          <Button variant="ghost">
            ← {common.buttons.back}
          </Button>
        </Link>
      </div>
    </AppLayout>
  );
};

export default ClassesIndex;