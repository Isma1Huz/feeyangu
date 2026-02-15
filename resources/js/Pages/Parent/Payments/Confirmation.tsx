import React from 'react';
import { Link } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Button } from '@/components/Common/Button';
import { Card } from '@/components/Common/Card';
import { translations } from '@/lib/data';

const ParentPaymentConfirmation = () => {
  const data = translations.payments;
  const common = translations.common;

  return (
    <AppLayout title={data.confirmation}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Success Message */}
        <Card className="bg-green-50 border border-green-200 text-center py-12">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-green-900 mb-2">
            {data.success}
          </h2>
          <p className="text-green-700">
            {data.submittedMessage}
          </p>
        </Card>

        {/* Details */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {common.labels.whatNext}
          </h3>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-cyan-100 text-cyan-600 text-sm font-semibold">
                1
              </span>
              <span className="text-gray-700">
                {data.nextStep1}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-cyan-100 text-cyan-600 text-sm font-semibold">
                2
              </span>
              <span className="text-gray-700">
                {data.nextStep2}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-cyan-100 text-cyan-600 text-sm font-semibold">
                3
              </span>
              <span className="text-gray-700">
                {data.nextStep3}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-cyan-100 text-cyan-600 text-sm font-semibold">
                4
              </span>
              <span className="text-gray-700">
                {data.nextStep4}
              </span>
            </li>
          </ol>
        </Card>

        {/* Important Notice */}
        <Card className="bg-yellow-50 border border-yellow-200">
          <h3 className="text-sm font-semibold text-yellow-900 mb-2">
            ⚠️ {data.importantNotice}
          </h3>
          <p className="text-sm text-yellow-800">
            {data.importantMessage}
          </p>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/parent/dashboard">
            <Button variant="primary" fullWidth>
              {common.buttons.backToDashboard}
            </Button>
          </Link>
          <Link href="/parent/receipts">
            <Button variant="secondary" fullWidth>
              {data.viewReceipts}
            </Button>
          </Link>
          <Link href="/parent/students">
            <Button variant="ghost" fullWidth>
              {data.viewFees}
            </Button>
          </Link>
        </div>

        {/* Contact Support */}
        <Card>
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            ❓ {data.haveQuestions}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {data.contactSupport}
          </p>
          <p className="text-sm">
            <span className="font-medium text-gray-800">{data.email}:</span>{' '}
            <a href="mailto:support@school.com" className="text-cyan-600 hover:text-cyan-700">
              support@school.com
            </a>
          </p>
          <p className="text-sm mt-2">
            <span className="font-medium text-gray-800">{data.phone}:</span>{' '}
            <a href="tel:+1234567890" className="text-cyan-600 hover:text-cyan-700">
              +1 (234) 567-890
            </a>
          </p>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ParentPaymentConfirmation;