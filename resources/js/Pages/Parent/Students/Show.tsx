import React from 'react';
import { Link } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Button } from '@/components/Common/Button';
import { Badge } from '@/components/Common/Badge';
import { Card } from '@/components/Common/Card';
import { StatCard } from '@/components/Common/StatCard';
import { Table } from '@/components/Common/Table';
import { translations } from '@/lib/data';
import { Student, StudentStatistics, StudentFee } from '@/types/index';

interface ParentStudentShowProps {
  student: Student;
  statistics: StudentStatistics;
  fees: StudentFee[];
}

const ParentStudentShow: React.FC<ParentStudentShowProps> = ({
  student,
  statistics,
  fees,
}) => {
  const data = translations.students;
  const feeData = translations.fees;
  const common = translations.common;
  const paymentData = translations.payments;

  const feeColumns = [
    {
      key: 'fee_name',
      label: feeData.singular,
    },
    {
      key: 'amount_due',
      label: 'Amount Due',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: 'amount_paid',
      label: 'Paid',
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
    {
      key: 'id',
      label: common.labels.actions,
      render: (value: string, row: any) => (
        row.balance > 0 && (
          <Link href={`/parent/payments/create?fee=${value}`}>
            <Button variant="primary" size="sm">
              {paymentData.pay}
            </Button>
          </Link>
        )
      ),
    },
  ];

  return (
    <AppLayout title={`${data.singular} - ${student.full_name}`}>
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
          <Link href="/parent/students">
            <Button variant="ghost">
              ← {common.buttons.back}
            </Button>
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            label={data.totalFeesDue}
            value={`$${statistics.total_fees?.toLocaleString()}`}
            backgroundColor="bg-gradient-to-br from-blue-50 to-cyan-50"
          />
          <StatCard
            label="Total Paid"
            value={`$${statistics.total_paid?.toLocaleString()}`}
            backgroundColor="bg-gradient-to-br from-green-50 to-emerald-50"
          />
          <StatCard
            label="Balance Due"
            value={`$${statistics.total_due?.toLocaleString()}`}
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

        {/* Payment Instructions */}
        {fees.some((f) => f.balance > 0) && (
          <Card className="bg-blue-50 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              💡 {data.paymentInstructions}
            </h3>
            <p className="text-sm text-blue-800 mb-4">
              {data.paymentMessage}
            </p>
            <Link href={`/parent/payments/create?student=${student.id}`}>
              <Button variant="primary" size="lg">
                {paymentData.makePay}
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default ParentStudentShow;