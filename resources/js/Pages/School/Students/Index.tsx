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
import { PaginatedResponse, Student } from '@/types';

interface StudentsIndexProps {
  students: PaginatedResponse<Student>;
  filters?: Record<string, any>;
  grades: Array<{ id: number; name: string }>;
}

const StudentsIndex: React.FC<StudentsIndexProps> = ({
  students,
  filters = {},
  grades,
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [gradeFilter, setGradeFilter] = useState(filters.grade || '');
  const data = translations.students;
  const common = translations.common;

  const columns = [
    {
      key: 'admission_no',
      label: data.admissionNo,
    },
    {
      key: 'full_name',
      label: data.fullName,
    },
    {
      key: 'email',
      label: data.email,
    },
    {
      key: 'grade_name',
      label: data.grade,
    },
    {
      key: 'is_active',
      label: data.status,
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
          <Link href={`/school/students/${value}`}>
            <Button variant="ghost" size="sm">
              {common.buttons.view}
            </Button>
          </Link>
          <Link href={`/school/students/${value}/edit`}>
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

  return (
    <AppLayout title={data.list}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">{data.list}</h1>
          <Link href="/school/students/create">
            <Button variant="primary" size="lg">
              + {data.create}
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder={`${common.buttons.search} ${data.singular}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              options={gradeOptions}
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
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
            data={students.data || []}
            emptyMessage={data.noStudents}
          />
          <Pagination
            currentPage={students.current_page || 1}
            lastPage={students.last_page || 1}
            perPage={students.per_page || 15}
            total={students.total || 0}
            onPageChange={() => {}}
          />
        </Card>
      </div>
    </AppLayout>
  );
};

export default StudentsIndex;