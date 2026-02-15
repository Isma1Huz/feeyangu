import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Button } from '@/components/Common/Button';
import { Input } from '@/components/Common/Input';
import { Table } from '@/components/Common/Table';
import { Badge } from '@/components/Common/Badge';
import { Pagination } from '@/components/Common/Pagination';
import { Card } from '@/components/Common/Card';
import { StatCard } from '@/components/Common/StatCard';
import { translations } from '@/lib/data';
import { PaginatedResponse, Student } from '@/types/index';

interface ParentStudentsIndexProps {
  students: PaginatedResponse<Student>;
  filters?: Record<string, any>;
}

const ParentStudentsIndex: React.FC<ParentStudentsIndexProps> = ({
  students,
  filters = {},
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
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
      key: 'grade_name',
      label: data.grade,
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
        <Link href={`/parent/students/${value}`}>
          <Button variant="primary" size="sm">
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
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {data.myChildren}
          </h1>
          <p className="text-gray-600 mt-1">
            {data.childrenDescription}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label={data.totalChildren}
            value={students.total || 0}
            backgroundColor="bg-gradient-to-br from-blue-50 to-cyan-50"
          />
          <StatCard
            label={data.activeChildren}
            value={students.data?.filter((s) => s.is_active).length || 0}
            backgroundColor="bg-gradient-to-br from-green-50 to-emerald-50"
          />
          <StatCard
            label={data.grades}
            value={[...new Set(students.data?.map((s) => s.grade_name))].length}
            backgroundColor="bg-gradient-to-br from-purple-50 to-pink-50"
          />
        </div>

        {/* Filter */}
        <Card>
          <Input
            placeholder={`${common.buttons.search} ${data.fullName}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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

export default ParentStudentsIndex;