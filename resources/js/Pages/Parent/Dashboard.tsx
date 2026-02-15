import React from 'react';
import { Link } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { StatCard } from '@/components/Common/StatCard';
import { Card } from '@/components/Common/Card';
import { Button } from '@/components/Common/Button';
import { Badge } from '@/components/Common/Badge';
import { Table } from '@/components/Common/Table';
import { translations } from '@/lib/data';
import { ParentDashboardStats, Student, StudentFee } from '@/types/index';

interface ParentDashboardProps {
  summary: ParentDashboardStats;
  children: Student[];
  unpaidFees: (StudentFee & {
    student_name: string;
    student_id: number;
    dueDate: string;
  })[];
  recentPayments: Array<{
    id: number;
    student_name: string;
    fee_name: string;
    amount: number;
    paid_at: string;
  }>;
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({
  summary,
  children,
  unpaidFees,
  recentPayments,
}) => {
  const data = translations.dashboard;
  const studentData = translations.students;
  const paymentData = translations.payments;
  const common = translations.common;
  const feeData = translations.fees;

  const unpaidColumns = [
    {
      key: 'student_name',
      label: studentData.singular,
    },
    {
      key: 'fee_name',
      label: feeData.singular,
    },
    {
      key: 'balance',
      label: paymentData.amount,
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: 'dueDate',
      label: 'Due Date',
    },
    {
      key: 'id',
      label: common.labels.actions,
      render: (value: string, row: any) => (
        <Link href={`/parent/payments/create?fee=${value}`}>
          <Button variant="primary" size="sm">
            {paymentData.makePay}
          </Button>
        </Link>
      ),
    },
  ];

  const paymentColumns = [
    {
      key: 'student_name',
      label: studentData.singular,
    },
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
      key: 'paid_at',
      label: 'Date',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <AppLayout title={data.title}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            {data.welcome}!
          </h2>
          <p className="text-gray-600 mt-1">
            {data.trackChildrenFees}
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label={data.metrics.totalFeesAssigned}
            value={`$${summary.totalFeesAssigned?.toLocaleString()}`}
            backgroundColor="bg-gradient-to-br from-blue-50 to-cyan-50"
          />
          <StatCard
            label={data.metrics.totalFeesPaid}
            value={`$${summary.totalFeesPaid?.toLocaleString()}`}
            trend="up"
            change={20}
            backgroundColor="bg-gradient-to-br from-green-50 to-emerald-50"
          />
          <StatCard
            label={data.metrics.totalFeesPending}
            value={`$${summary.totalFeesBalance?.toLocaleString()}`}
            backgroundColor="bg-gradient-to-br from-orange-50 to-red-50"
          />
          <StatCard
            label={data.metrics.collectionRate}
            value={`${summary.paymentCompletionRate}%`}
            backgroundColor="bg-gradient-to-br from-purple-50 to-pink-50"
          />
        </div>

        {/* Children & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Children List */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {data.myChildren}
            </h3>
            <div className="space-y-2">
              {children && children.length > 0 ? (
                children.map((child) => (
                  <Link key={child.id} href={`/parent/students/${child.id}`}>
                    <div className="p-3 border border-gray-200 rounded-lg hover:bg-cyan-50 cursor-pointer transition-colors">
                      <p className="font-medium text-gray-800">
                        {child.full_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {studentData.admissionNo}: {child.admission_no}
                      </p>
                      <p className="text-sm text-gray-500">
                        {studentData.grade}: {child.grade_name}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 text-sm">
                  {data.noChildren}
                </p>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {common.labels.quickActions}
            </h3>
            <div className="space-y-2">
              <Link href="/parent/students">
                <Button variant="ghost" fullWidth className="justify-start">
                  👥 {data.viewChildren}
                </Button>
              </Link>
              <Link href="/parent/receipts">
                <Button variant="ghost" fullWidth className="justify-start">
                  📄 {data.viewReceipts}
                </Button>
              </Link>
              <Link href="/parent/payments/create">
                <Button variant="ghost" fullWidth className="justify-start">
                  💳 {paymentData.makePay}
                </Button>
              </Link>
            </div>
          </Card>

          {/* Summary Card */}
          <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {data.paymentSummary}
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">
                  {data.metrics.totalFeesAssigned}
                </p>
                <p className="text-2xl font-bold text-cyan-600">
                  ${summary.totalFeesAssigned?.toLocaleString()}
                </p>
              </div>
              <div className="border-t border-cyan-200 pt-3">
                <p className="text-sm text-gray-600">
                  {data.metrics.totalFeesPending}
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  ${summary.totalFeesBalance?.toLocaleString()}
                </p>
              </div>
              <div className="border-t border-cyan-200 pt-3">
                <p className="text-sm text-gray-600">
                  {data.metrics.collectionRate}
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {summary.paymentCompletionRate}%
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Unpaid Fees */}
        {unpaidFees && unpaidFees.length > 0 && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {data.pendingPayments}
              </h3>
              <Badge
                label={unpaidFees.length.toString()}
                variant="danger"
              />
            </div>
            <Table
              columns={unpaidColumns}
              data={unpaidFees}
              emptyMessage={data.noPayments}
            />
          </Card>
        )}

        {/* Recent Payments */}
        {recentPayments && recentPayments.length > 0 && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {data.recentPayments}
              </h3>
              <Link href="/parent/receipts">
                <Button variant="secondary" size="sm">
                  {common.buttons.viewAll}
                </Button>
              </Link>
            </div>
            <Table
              columns={paymentColumns}
              data={recentPayments.slice(0, 5)}
              emptyMessage={data.noPayments}
            />
          </Card>
        )}

        {/* Payment Instructions */}
        <Card className="bg-amber-50 border border-amber-200">
          <h3 className="text-lg font-semibold text-amber-900 mb-4">
            💡 {data.paymentInstructions}
          </h3>
          <ul className="space-y-2 text-sm text-amber-800">
            <li>• {data.instruction1}</li>
            <li>• {data.instruction2}</li>
            <li>• {data.instruction3}</li>
            <li>• {data.instruction4}</li>
          </ul>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ParentDashboard;