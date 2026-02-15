import React from 'react';
import { Link } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { StatCard } from '@/components/Common/StatCard';
import { Card } from '@/components/Common/Card';
import { Button } from '@/components/Common/Button';
import { Badge } from '@/components/Common/Badge';
import { Table } from '@/components/Common/Table';
import { translations } from '@/lib/data';
import { SuperAdminDashboardStats } from '@/types/index';

interface AdminDashboardProps {
  stats: SuperAdminDashboardStats & {
    recentSchools: Array<{
      id: number;
      name: string;
      students_count: number;
      subscription_status: string;
      created_at: string;
    }>;
    topSchools: Array<{
      id: number;
      name: string;
      total_collected: number;
      total_assigned: number;
      collection_rate: number;
    }>;
    systemHealth: {
      active_schools: number;
      inactive_schools: number;
      total_users: number;
      database_size: string;
    };
  };
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ stats }) => {
  const data = translations.dashboard;
  const common = translations.common;
  const schoolData = translations.schools;
  const studentData = translations.students;

  const schoolColumns = [
    {
      key: 'name',
      label: schoolData.singular,
    },
    {
      key: 'students_count',
      label: studentData?.totalStudents,
    },
    {
      key: 'subscription_status',
      label: data.subscription,
      render: (value: string) => {
        const statusMap: any = {
          active: 'success',
          inactive: 'default',
          suspended: 'danger',
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
      key: 'created_at',
      label: 'Joined',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'id',
      label: common.labels.actions,
      render: (value: string) => (
        <Link href={`/admin/schools/${value}`}>
          <Button variant="ghost" size="sm">
            {common.buttons.view}
          </Button>
        </Link>
      ),
    },
  ];

  const topSchoolsColumns = [
    {
      key: 'name',
      label: schoolData.singular,
    },
    {
      key: 'total_collected',
      label: data.metrics.totalFeesCollected,
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: 'total_assigned',
      label: data.metrics.totalFeesAssigned,
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: 'collection_rate',
      label: data.metrics.collectionRate,
      render: (value: number) => `${value}%`,
    },
  ];

  return (
    <AppLayout title={data.superAdminDashboard}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            {data?.welcome}, Super Admin!
          </h2>
          <p className="text-gray-600 mt-1">
            {data?.platformOverview}
          </p>
        </div>

        {/* Primary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* <StatCard
            label={data?.metrics?.totalSchools}
            value={stats.totalSchools}
            trend="up"
            change={5}
            backgroundColor="bg-gradient-to-br from-blue-50 to-cyan-50"
          /> */}
          {/* <StatCard
            label={data?.metrics?.totalStudents}
            value={stats.totalStudents?.toLocaleString()}
            trend="up"
            change={12}
            backgroundColor="bg-gradient-to-br from-green-50 to-emerald-50"
          />
          <StatCard
            label={data?.metrics?.totalParents}
            value={stats.totalParents?.toLocaleString()}
            backgroundColor="bg-gradient-to-br from-purple-50 to-pink-50"
          />
          <StatCard
            label={data?.metrics?.totalFeesCollected}
            value={`$${stats?.totalFeesCollected?.toLocaleString()}`}
            trend="up"
            change={8}
            backgroundColor="bg-gradient-to-br from-yellow-50 to-orange-50"
          /> */}
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* <StatCard
            label={data.metrics.totalFeesAssigned}
            value={`$${stats.totalFeesAssigned?.toLocaleString()}`}
            backgroundColor="bg-gradient-to-br from-indigo-50 to-blue-50"
          />
          <StatCard
            label={data.metrics.totalFeesPending}
            value={`$${stats.totalFeesPending?.toLocaleString()}`}
            backgroundColor="bg-gradient-to-br from-red-50 to-pink-50"
          />
          <StatCard
            label={data.metrics.collectionRate}
            value={`${stats.collectionRate}%`}
            trend={stats.collectionRate > 70 ? 'up' : 'down'}
            backgroundColor="bg-gradient-to-br from-teal-50 to-cyan-50"
          /> */}
        </div>

        {/* System Health & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Health */}
          {/* <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {data.systemHealth}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">
                  {data.activeSchools}
                </span>
                <span className="text-lg font-bold text-green-600">
                  {stats.systemHealth?.active_schools}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">
                  {data.inactiveSchools}
                </span>
                <span className="text-lg font-bold text-orange-600">
                  {stats.systemHealth?.inactive_schools}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">
                  {data.totalUsers}
                </span>
                <span className="text-lg font-bold text-blue-600">
                  {stats.systemHealth?.total_users}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">
                  {data.databaseSize}
                </span>
                <span className="text-lg font-bold text-purple-600">
                  {stats.systemHealth?.database_size}
                </span>
              </div>
            </div>
          </Card> */}

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {common.labels.quickActions}
            </h3>
            <div className="space-y-2">
              <Link href="/admin/schools">
                <Button variant="ghost" fullWidth className="justify-start">
                  🏫 {data.manageSchools}
                </Button>
              </Link>
              <Link href="/admin/schools/create">
                <Button variant="ghost" fullWidth className="justify-start">
                  ➕ {data.createSchool}
                </Button>
              </Link>
              <Link href="/admin/settings">
                <Button variant="ghost" fullWidth className="justify-start">
                  ⚙️ {data.systemSettings}
                </Button>
              </Link>
              <Link href="/admin/reports">
                <Button variant="ghost" fullWidth className="justify-start">
                  📊 {data.viewReports}
                </Button>
              </Link>
            </div>
          </Card>

          {/* Overview Card */}
          <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {data.platformSummary}
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">
                  {data.avgCollectionRate}
                </p>
                <p className="text-2xl font-bold text-cyan-600">
                  {stats.collectionRate}%
                </p>
              </div>
              <div className="border-t border-cyan-200 pt-3">
                <p className="text-sm text-gray-600">
                  {data.overdueAmount}
                </p>
                <p className="text-2xl font-bold text-red-600">
                  ${stats.overdueAmount?.toLocaleString()}
                </p>
              </div>
              <div className="border-t border-cyan-200 pt-3">
                <p className="text-sm text-gray-600">
                  {data.revenue}
                </p>
                <p className="text-2xl font-bold text-green-600">
                  ${stats.totalFeesCollected?.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Top Performing Schools */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {data.topPerformingSchools}
            </h3>
            <Link href="/admin/schools">
              <Button variant="secondary" size="sm">
                {common.buttons.viewAll}
              </Button>
            </Link>
          </div>
          <Table
            columns={topSchoolsColumns}
            data={stats.topSchools?.slice(0, 5) || []}
            emptyMessage="No schools yet"
          />
        </Card>

        {/* Recent Schools */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {data.recentSchools}
            </h3>
            <Link href="/admin/schools">
              <Button variant="secondary" size="sm">
                {common.buttons.viewAll}
              </Button>
            </Link>
          </div>
          <Table
            columns={schoolColumns}
            data={stats.recentSchools?.slice(0, 5) || []}
            emptyMessage="No schools yet"
          />
        </Card>

        {/* Collection Trend Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {data.collectionTrend}
          </h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              📊 {data.chartPlaceholder}
            </p>
          </div>
        </Card>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {data.performanceMetrics}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {data.avgStudentsPerSchool}
                </span>
                <span className="font-bold text-gray-800">
                  {(stats.totalStudents / stats.totalSchools)?.toFixed(0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {data.avgParentsPerSchool}
                </span>
                <span className="font-bold text-gray-800">
                  {(stats.totalParents / stats.totalSchools)?.toFixed(0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {data.avgFeesPerStudent}
                </span>
                <span className="font-bold text-gray-800">
                  ${(stats.totalFeesAssigned / stats.totalStudents)?.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {data.avgCollectionPerStudent}
                </span>
                <span className="font-bold text-gray-800">
                  ${(stats.totalFeesCollected / stats.totalStudents)?.toFixed(2)}
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {data.alerts}
            </h3>
            <div className="space-y-2">
              {stats.overdueCount > 0 && (
                <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <span className="text-xl">⚠️</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900">
                      {data.overduePayments}
                    </p>
                    <p className="text-xs text-red-700">
                      {stats.overdueCount} {data.overdueCount}
                    </p>
                  </div>
                </div>
              )}
              {stats.totalSchools < 5 && (
                <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <span className="text-xl">💡</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-900">
                      {data.lowSchoolCount}
                    </p>
                    <p className="text-xs text-yellow-700">
                      {data.considerMarketing}
                    </p>
                  </div>
                </div>
              )}
              {stats.collectionRate < 70 && (
                <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <span className="text-xl">📉</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-orange-900">
                      {data.lowCollectionRate}
                    </p>
                    <p className="text-xs text-orange-700">
                      {data.improveCollection}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;