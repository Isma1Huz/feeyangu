import React from 'react';
import { Link } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Button } from '@/components/Common/Button';
import { Badge } from '@/components/Common/Badge';
import { Card } from '@/components/Common/Card';
import { StatCard } from '@/components/Common/StatCard';
import { Table } from '@/components/Common/Table';
import { translations } from '@/lib/data';
import { Grade } from '@/types/index';

interface GradeShowProps {
  grade: Grade;
  statistics: any;
  students: any[];
}

const GradeShow: React.FC<GradeShowProps> = ({
  grade,
  statistics,
  students,
}) => {
  const data = translations.grades;
  const studentData = translations.students;
  const common = translations.common;

  const studentColumns = [
    {
      key: 'admission_no',
      label: studentData.admissionNo,
    },
    {
      key: 'full_name',
      label: studentData.fullName,
    },
    {
      key: 'email',
      label: studentData.email,
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
  ];

  return (
    <AppLayout title={data.show}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {grade.name}
            </h1>
            <p className="text-gray-600 mt-1">
              Code: {grade.code}
            </p>
          </div>
          <div className="flex gap-3">
            <Link href={`/school/grades/${grade.id}/edit`}>
              <Button variant="secondary">
                {common.buttons.edit}
              </Button>
            </Link>
            <Link href="/school/grades">
              <Button variant="ghost">
                ← {common.buttons.back}
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label="Total Students"
            value={statistics.total_students}
            backgroundColor="bg-gradient-to-br from-blue-50 to-cyan-50"
          />
          <StatCard
            label="Active"
            value={statistics.active_students}
            backgroundColor="bg-gradient-to-br from-green-50 to-emerald-50"
          />
          <StatCard
            label={common.labels.status}
            value={grade.is_active ? common.buttons.active : common.buttons.inactive}
            backgroundColor="bg-gradient-to-br from-purple-50 to-pink-50"
          />
        </div>

        {/* Details */}
        <Card className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 font-medium mb-2">
              {data.code}
            </p>
            <p className="text-lg font-semibold text-gray-800">
              {grade.code}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-2">
              {data.level}
            </p>
            <p className="text-lg font-semibold text-gray-800">
              {grade.level || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-2">
              {common.labels.status}
            </p>
            <Badge
              label={grade.is_active ? common.buttons.active : common.buttons.inactive}
              variant={grade.is_active ? 'success' : 'default'}
              size="md"
            />
          </div>
        </Card>

        {/* Students */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {studentData.list}
          </h3>
          <Table
            columns={studentColumns}
            data={students || []}
            emptyMessage="No students in this grade"
          />
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Link href={`/school/grades/${grade.id}/classes`}>
            <Button variant="primary">
              View Classes
            </Button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
};

export default GradeShow;