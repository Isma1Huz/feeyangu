import React from 'react';
import { Link } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { StatCard } from '@/components/Common/StatCard';
import { Card } from '@/components/Common/Card';
import { Button } from '@/components/Common/Button';
import { Badge } from '@/components/Common/Badge';
import { Table } from '@/components/Common/Table';
import { translations } from '@/lib/data';
import { SchoolDashboardStats } from '@/types/index';

interface SchoolDashboardProps {
  stats: SchoolDashboardStats & {
    recentPayments: Array<{
      id: number;
      student_name: string;
      amount: number;
      payment_method: string;
      paid_at: string;
    }>;
    pendingPayments: Array<{
      id: number;
      student_name: string;
      fee_name: string;
      amount: number;
      status: string;
    }>;
    upcomingTerms: Array<{
      id: number;
      name: string;
      start_date: string;
      end_date: string;
    }>;
  };
}

const SchoolDashboard: React.FC<SchoolDashboardProps> = ({ stats }) => {
  const data = translations.dashboard;
  const common = translations.common;
  const studentData = translations.students;
  const paymentData = translations.payments;
  const feeData = translations.fees;

  const paymentColumns = [
    {
      key: 'student_name',
      label: studentData.singular,
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

  const pendingColumns = [
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
      key: 'status',
      label: common.labels.status,
      render: (value: string) => (
        <Badge
          label={value.charAt(0).toUpperCase() + value.slice(1)}
          variant={value === 'unpaid' ? 'danger' : 'warning'}
        />
      ),
    },
  ];

  return (
    <AppLayout title={data.title}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            {data.welcome}, School Admin!
          </h2>
          <p className="text-gray-600 mt-1">
            {data.schoolOverview}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label={data.metrics.totalStudents}
            value={stats.totalStudents}
            backgroundColor="bg-gradient-to-br from-blue-50 to-cyan-50"
          />
          <StatCard
            label={data.metrics.totalParents}
            value={stats.totalParents}
            backgroundColor="bg-gradient-to-br from-green-50 to-emerald-50"
          />
          <StatCard
            label={data.metrics.totalFeesCollected}
            value={`$${stats.totalCollected?.toLocaleString()}`}
            trend="up"
            change={stats.collectionTrend}
            backgroundColor="bg-gradient-to-br from-yellow-50 to-orange-50"
          />
          <StatCard
            label={data.metrics.collectionRate}
            value={`${stats.collectionRate}%`}
            backgroundColor="bg-gradient-to-br from-purple-50 to-pink-50"
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label={data.metrics.totalFeesPending}
            value={`$${stats.totalPending?.toLocaleString()}`}
            backgroundColor="bg-gradient-to-br from-red-50 to-pink-50"
          />
          <StatCard
            label={data.metrics.overdueCount}
            value={stats.overdueCount}
            backgroundColor="bg-gradient-to-br from-orange-50 to-red-50"
          />
          <StatCard
            label="Active Terms"
            value={stats.activeTerms}
            backgroundColor="bg-gradient-to-br from-indigo-50 to-blue-50"
          />
        </div>

        {/* Quick Actions & Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {common.labels.quickActions}
            </h3>
            <div className="space-y-2">
              <Link href="/school/students">
                <Button variant="ghost" fullWidth className="justify-start">
                  👥 {data.manageStudents}
                </Button>
              </Link>
              <Link href="/school/fee-structures">
                <Button variant="ghost" fullWidth className="justify-start">
                  💰 {data.manageFees}
                </Button>
              </Link>
              <Link href="/school/payments">
                <Button variant="ghost" fullWidth className="justify-start">
                  💳 {data.viewPayments}
                </Button>
              </Link>
              <Link href="/school/grades">
                <Button variant="ghost" fullWidth className="justify-start">
                  📚 {data.manageGrades}
                </Button>
              </Link>
              <Link href="/school/terms">
                <Button variant="ghost" fullWidth className="justify-start">
                  📅 {data.manageTerms}
                </Button>
              </Link>
            </div>
          </Card>

          {/* Upcoming Terms */}
          <Card className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {data.upcomingTerms}
            </h3>
            <div className="space-y-3">
              {stats.upcomingTerms && stats.upcomingTerms.length > 0 ? (
                stats.upcomingTerms.map((term) => (
                  <div
                    key={term.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-cyan-50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {term.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(term.start_date).toLocaleDateString()} -{' '}
                        {new Date(term.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Link href={`/school/terms/${term.id}`}>
                      <Button variant="secondary" size="sm">
                        {common.buttons.view}
                      </Button>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">
                  No upcoming terms
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Recent Payments */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {data.recentPayments}
            </h3>
            <Link href="/school/payments">
              <Button variant="secondary" size="sm">
                {common.buttons.viewAll}
              </Button>
            </Link>
          </div>
          <Table
            columns={paymentColumns}
            data={stats.recentPayments?.slice(0, 5) || []}
            emptyMessage="No payments yet"
          />
        </Card>

        {/* Pending Fees */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {data.pendingPayments}
            </h3>
            <Link href="/school/payments">
              <Button variant="secondary" size="sm">
                {common.buttons.viewAll}
              </Button>
            </Link>
          </div>
          <Table
            columns={pendingColumns}
            data={stats.pendingPayments?.slice(0, 5) || []}
            emptyMessage="No pending payments"
          />
        </Card>

        {/* Statistics Summary */}
        <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            {data.performanceSummary}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                {data.metrics.totalFeesAssigned}
              </p>
              <p className="text-3xl font-bold text-cyan-600">
                ${stats.totalAssigned?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">
                {data.metrics.totalFeesPending}
              </p>
              <p className="text-3xl font-bold text-orange-600">
                ${stats.totalPending?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">
                {data.metrics.collectionRate}
              </p>
              <p className="text-3xl font-bold text-green-600">
                {stats.collectionRate}%
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default SchoolDashboard;