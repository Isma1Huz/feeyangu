import React from 'react';
import { Link } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Button } from '@/components/Common/Button';
import { Card } from '@/components/Common/Card';
import { Badge } from '@/components/Common/Badge';
import { StatCard } from '@/components/Common/StatCard';
import { Table } from '@/components/Common/Table';
import { translations } from '@/lib/data';
import { SchoolClass, Student } from '@/types/index';

interface ClassShowProps {
  schoolClass: SchoolClass;
  grade: { id: number; name: string };
  students: Student[];
  statistics: any;
}

const ClassShow: React.FC<ClassShowProps> = ({
  schoolClass,
  grade,
  students,
  statistics,
}) => {
  const data = translations.classes;
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
    <AppLayout title={`${data.singular} - ${schoolClass.name}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {schoolClass.name} ({grade.name})
            </h1>
            <p className="text-gray-600 mt-1">
              {data.classDetails}
            </p>
          </div>
          <div className="flex gap-3">
            <Link href={`/school/grades/${grade.id}/classes/${schoolClass.id}/edit`}>
              <Button variant="secondary">
                {common.buttons.edit}
              </Button>
            </Link>
            <Link href={`/school/grades/${grade.id}/classes`}>
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
            label={data.capacity}
            value={schoolClass.capacity || 'N/A'}
            backgroundColor="bg-gradient-to-br from-green-50 to-emerald-50"
          />
          <StatCard
            label="Available Seats"
            value={statistics.available_capacity}
            backgroundColor="bg-gradient-to-br from-purple-50 to-pink-50"
          />
        </div>

        {/* Class Details */}
        <Card className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 font-medium mb-2">
              {data.teacher}
            </p>
            <p className="text-lg font-semibold text-gray-800">
              {schoolClass.class_teacher_name || 'Not assigned'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-2">
              Grade
            </p>
            <p className="text-lg font-semibold text-gray-800">
              {grade.name}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-2">
              {common.labels.status}
            </p>
            <Badge
              label={schoolClass.is_active ? common.buttons.active : common.buttons.inactive}
              variant={schoolClass.is_active ? 'success' : 'default'}
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
            emptyMessage="No students in this class"
          />
        </Card>
      </div>
    </AppLayout>
  );
};

export default ClassShow;