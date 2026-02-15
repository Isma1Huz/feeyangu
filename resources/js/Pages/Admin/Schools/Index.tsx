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
import { StatCard } from '@/components/Common/StatCard';
import { translations } from '@/lib/data';
import { PaginatedResponse, School } from '@/types/index';

interface SchoolsIndexProps {
  schools: PaginatedResponse<School>;
  filters?: Record<string, any>;
}

const SchoolsIndex: React.FC<SchoolsIndexProps> = ({
  schools,
  filters = {},
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const data = translations.schools;
  const common = translations.common;

  const statusOptions = [
    { value: '', label: `${common.buttons.all} ${data.status}` },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' },
  ];

  const statusMap: any = {
    active: 'success',
    inactive: 'default',
    suspended: 'danger',
  };

  const columns = [
    {
      key: 'name',
      label: data.singular,
    },
    {
      key: 'owner_name',
      label: data.owner,
    },
    {
      key: 'students_count',
      label: 'Students',
    },
    {
      key: 'subscription_status',
      label: data.subscription,
      render: (value: string) => (
        <Badge
          label={value.charAt(0).toUpperCase() + value.slice(1)}
          variant={statusMap[value] || 'default'}
        />
      ),
    },
    {
      key: 'created_at',
      label: 'Joined',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'id',
      label: common.labels.actions,
      render: (value: string) => (
        <div className="flex gap-2">
          <Link href={`/admin/schools/${value}`}>
            <Button variant="ghost" size="sm">
              {common.buttons.view}
            </Button>
          </Link>
          <Link href={`/admin/schools/${value}/edit`}>
            <Button variant="secondary" size="sm">
              {common.buttons.edit}
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  const activeSchools = schools.data?.filter(
    (s) => s.subscription_status === 'active'
  ).length || 0;

  const totalStudents = schools.data?.reduce(
    (sum, s) => sum + (s.students_count || 0),
    0
  ) || 0;

  return (
    <AppLayout title={data.list}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">{data.list}</h1>
          <Link href="/admin/schools/create">
            <Button variant="primary" size="lg">
              + {data.create}
            </Button>
          </Link>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            label={data.totalSchools}
            value={schools.total || 0}
            backgroundColor="bg-gradient-to-br from-blue-50 to-cyan-50"
          />
          <StatCard
            label={data.activeSchools}
            value={activeSchools}
            backgroundColor="bg-gradient-to-br from-green-50 to-emerald-50"
          />
          <StatCard
            label="Total Students"
            value={totalStudents.toLocaleString()}
            backgroundColor="bg-gradient-to-br from-purple-50 to-pink-50"
          />
          <StatCard
            label="Avg per School"
            value={(totalStudents / (schools.total || 1)).toFixed(0)}
            backgroundColor="bg-gradient-to-br from-yellow-50 to-orange-50"
          />
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
            data={schools.data || []}
            emptyMessage={data.noSchools}
          />
          <Pagination
            currentPage={schools.current_page || 1}
            lastPage={schools.last_page || 1}
            perPage={schools.per_page || 15}
            total={schools.total || 0}
            onPageChange={() => {}}
          />
        </Card>
      </div>
    </AppLayout>
  );
};

export default SchoolsIndex;