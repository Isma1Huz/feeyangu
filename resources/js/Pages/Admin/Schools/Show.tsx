import React from 'react';
import { Link } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Button } from '@/components/Common/Button';
import { Badge } from '@/components/Common/Badge';
import { Card } from '@/components/Common/Card';
import { StatCard } from '@/components/Common/StatCard';
import { Table } from '@/components/Common/Table';
import { translations } from '@/lib/data';
import { School, SchoolStatistics } from '@/types/index';

interface SchoolShowProps {
  school: School;
  statistics: SchoolStatistics & {
    recent_students: Array<{ id: number; full_name: string }>;
    recent_payments: Array<{
      student_name: string;
      amount: number;
      paid_at: string;
    }>;
  };
}

const SchoolShow: React.FC<SchoolShowProps> = ({ school, statistics }) => {
  const data = translations.schools;
  const common = translations.common;

  const paymentColumns = [
    {
      key: 'student_name',
      label: translations.students.singular,
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: 'paid_at',
      label: 'Date',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  const statusMap: any = {
    active: 'success',
    inactive: 'default',
    suspended: 'danger',
  };

  return (
    <AppLayout title={`${data.singular} - ${school.name}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {school.name}
            </h1>
            <p className="text-gray-600 mt-1">
              Admin: {school.owner_name}
            </p>
          </div>
          <div className="flex gap-3">
            <Link href={`/admin/schools/${school.id}/edit`}>
              <Button variant="secondary">
                {common.buttons.edit}
              </Button>
            </Link>
            <Link href="/admin/schools">
              <Button variant="ghost">
                ← {common.buttons.back}
              </Button>
            </Link>
          </div>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            label={translations.students.totalStudents}
            value={statistics.total_students}
            backgroundColor="bg-gradient-to-br from-blue-50 to-cyan-50"
          />
          <StatCard
            label="Total Parents"
            value={statistics.total_parents}
            backgroundColor="bg-gradient-to-br from-green-50 to-emerald-50"
          />
          <StatCard
            label="Total Collected"
            value={`$${statistics.total_collected?.toLocaleString()}`}
            backgroundColor="bg-gradient-to-br from-yellow-50 to-orange-50"
          />
          <StatCard
            label="Collection Rate"
            value={`${statistics.collection_rate}%`}
            backgroundColor="bg-gradient-to-br from-purple-50 to-pink-50"
          />
        </div>

        {/* School Details */}
        <Card className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 font-medium mb-2">
              {data.email}
            </p>
            <p className="text-lg font-semibold text-gray-800">
              {school.email || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-2">
              {data.phone}
            </p>
            <p className="text-lg font-semibold text-gray-800">
              {school.phone || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-2">
              {data.subscription}
            </p>
            <Badge
              label={school.subscription_status?.charAt(0).toUpperCase() + school.subscription_status?.slice(1)}
              variant={statusMap[school.subscription_status] || 'default'}
              size="md"
            />
          </div>
        </Card>

        {/* Contact Information */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {data.contactInformation}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-2">
                {data.ownerEmail}
              </p>
              <p className="text-gray-800">
                {school.owner_email}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium mb-2">
                {data.ownerPhone}
              </p>
              <p className="text-gray-800">
                {school.owner_phone || 'N/A'}
              </p>
            </div>
            {school.address && (
              <div className="col-span-full">
                <p className="text-sm text-gray-600 font-medium mb-2">
                  {data.address}
                </p>
                <p className="text-gray-800">
                  {school.address}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Financial Summary */}
        <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {data.financialSummary}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Total Fees Assigned
              </p>
              <p className="text-3xl font-bold text-cyan-600">
                ${statistics.total_assigned?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Total Fees Collected
              </p>
              <p className="text-3xl font-bold text-green-600">
                ${statistics.total_collected?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Outstanding Balance
              </p>
              <p className="text-3xl font-bold text-orange-600">
                ${(statistics.total_assigned - statistics.total_collected)?.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Recent Students */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {translations.students.recentStudents}
          </h3>
          <div className="space-y-2">
            {statistics.recent_students?.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <p className="font-medium text-gray-800">
                  {student.full_name}
                </p>
                <Link href={`/admin/schools/${school.id}/students/${student.id}`}>
                  <Button variant="ghost" size="sm">
                    {common.buttons.view}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Payments */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {translations.dashboard.recentPayments}
          </h3>
          <Table
            columns={paymentColumns}
            data={statistics.recent_payments || []}
            emptyMessage="No recent payments"
          />
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Link href={`/admin/schools/${school.id}/edit`}>
            <Button variant="primary">
              {common.buttons.edit}
            </Button>
          </Link>
          <Link href="/admin/schools">
            <Button variant="secondary">
              {common.buttons.back}
            </Button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
};

export default SchoolShow;