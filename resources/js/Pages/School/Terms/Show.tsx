import React from 'react';
import { Link } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Button } from '@/components/Common/Button';
import { Badge } from '@/components/Common/Badge';
import { Card } from '@/components/Common/Card';
import { StatCard } from '@/components/Common/StatCard';
import { translations } from '@/lib/data';
import { Term } from '@/types/index';

interface TermShowProps {
  term: Term;
  statistics: any;
}

const TermShow: React.FC<TermShowProps> = ({ term, statistics }) => {
  const data = translations.terms;
  const common = translations.common;

  return (
    <AppLayout title={data.show}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {term.name} {term.year}
            </h1>
            <p className="text-gray-600 mt-1">
              Term {term.term_number}
            </p>
          </div>
          <div className="flex gap-3">
            <Link href={`/school/terms/${term.id}/edit`}>
              <Button variant="secondary">
                {common.buttons.edit}
              </Button>
            </Link>
            <Link href="/school/terms">
              <Button variant="ghost">
                ← {common.buttons.back}
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label="Total Fee Structures"
            value={statistics.fee_structures_count || 0}
            backgroundColor="bg-gradient-to-br from-blue-50 to-cyan-50"
          />
          <StatCard
            label="Total Students"
            value={statistics.students_count || 0}
            backgroundColor="bg-gradient-to-br from-green-50 to-emerald-50"
          />
          <StatCard
            label="Total Collected"
            value={`$${statistics.total_collected || 0}`}
            backgroundColor="bg-gradient-to-br from-purple-50 to-pink-50"
          />
        </div>

        {/* Details */}
        <Card className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 font-medium mb-2">
              {data.startDate}
            </p>
            <p className="text-lg font-semibold text-gray-800">
              {new Date(term.start_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-2">
              {data.endDate}
            </p>
            <p className="text-lg font-semibold text-gray-800">
              {new Date(term.end_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-2">
              {common.labels.status}
            </p>
            <Badge
              label={term.is_active ? common.buttons.active : common.buttons.inactive}
              variant={term.is_active ? 'success' : 'default'}
              size="md"
            />
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default TermShow;