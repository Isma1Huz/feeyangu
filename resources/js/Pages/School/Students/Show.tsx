import React from 'react';
import { Link } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Button } from '@/components/Common/Button';
import { Badge } from '@/components/Common/Badge';
import { Card } from '@/components/Common/Card';
import { StatCard } from '@/components/Common/StatCard';
import { Table } from '@/components/Common/Table';
import { translations } from '@/lib/data';
import { Student, StudentStatistics, StudentFee } from '@/types';

interface StudentShowProps {
  student: Student;
  statistics: StudentStatistics;
  fees: StudentFee[];
  payments: any[];
}

const StudentShow: React.FC<StudentShowProps> = ({
  student,
  statistics,
  fees,
  payments,
}) => {
  const data = translations.students;
  const feeData = translations.fees;
  const paymentData = translations.payments;
  const common = translations.common;

  const feeColumns = [
    {
      key: 'fee_name',
      label: feeData.singular,
    },
    {
      key: 'amount_due',
      label: data.totalFeesDue,
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: 'amount_paid',
      label: 'Amount Paid',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: 'balance',
      label: 'Balance',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: 'status',
      label: common.labels.status,
      render: (value: string) => {
        const statusMap: any = {
          paid: 'success',
          unpaid: 'danger',
          partially_paid: 'warning',
          overdue: 'danger',
        };
        return (
          <Badge
            label={value.charAt(0).toUpperCase() + value.slice(1)}
            variant={statusMap[value] || 'default'}
          />
        );
      },
    },
  ];

  const paymentColumns = [
    {
      key: 'fee_name',
      label: feeData.singular,
    },
    {
      key: 'amount',
      label: paymentData.amount,
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: 'payment_method',
      label: paymentData.method,
    },
    {
      key: 'paid_at',
      label: 'Date',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <AppLayout title={data.show}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {student.full_name}
            </h1>
            <p className="text-gray-600 mt-1">
              {data.admissionNo}: {student.admission_no}
            </p>
          </div>
          <div className="flex gap-3">
            <Link href={`/school/students/${student.id}/edit`}>
              <Button variant="secondary">
                {common.buttons.edit}
              </Button>
            </Link>
            <Link href="/school/students">
              <Button variant="ghost">
                ← {common.buttons.back}
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            label={data.totalFeesDue}
            value={`$${statistics.total_fees}`}
            backgroundColor="bg-gradient-to-br from-blue-50 to-cyan-50"
          />
          <StatCard
            label="Total Paid"
            value={`$${statistics.total_paid}`}
            backgroundColor="bg-gradient-to-br from-green-50 to-emerald-50"
          />
          <StatCard
            label="Balance Due"
            value={`$${statistics.total_due}`}
            backgroundColor="bg-gradient-to-br from-orange-50 to-red-50"
          />
          <StatCard
            label="Payment Rate"
            value={`${statistics.payment_rate}%`}
            backgroundColor="bg-gradient-to-br from-purple-50 to-pink-50"
          />
        </div>

        {/* Student Details */}
        <Card className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 font-medium mb-2">
              {data.grade}
            </p>
            <p className="text-lg font-semibold text-gray-800">
              {student.grade_name || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-2">
              {common.labels.email}
            </p>
            <p className="text-lg font-semibold text-gray-800">
              {student.email || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-2">
              {common.labels.status}
            </p>
            <Badge
              label={student.is_active ? common.buttons.active : common.buttons.inactive}
              variant={student.is_active ? 'success' : 'default'}
              size="md"
            />
          </div>
        </Card>

        {/* Fees Table */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {data.fees}
          </h3>
          <Table
            columns={feeColumns}
            data={fees || []}
            emptyMessage="No fees assigned"
          />
        </Card>

        {/* Payments Table */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {data.payments}
          </h3>
          <Table
            columns={paymentColumns}
            data={payments || []}
            emptyMessage="No payments recorded"
          />
        </Card>
      </div>
    </AppLayout>
  );
};

export default StudentShow;