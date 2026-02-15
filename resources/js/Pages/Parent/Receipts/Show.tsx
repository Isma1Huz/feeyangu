import React from 'react';
import { Link } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Button } from '@/components/Common/Button';
import { Card } from '@/components/Common/Card';
import { translations } from '@/lib/data';
import { Receipt } from '@/types/index';

interface ParentReceiptShowProps {
  receipt: Receipt;
}

const ParentReceiptShow: React.FC<ParentReceiptShowProps> = ({ receipt }) => {
  const data = translations.receipts;
  const common = translations.common;

  return (
    <AppLayout title={data.show}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {data.show}
            </h1>
            <p className="text-gray-600 mt-1">
              {data.receiptNo}: {receipt.receipt_number}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                window.location.href = `/parent/receipts/${receipt.id}/download`;
              }}
            >
              ⬇️ {data.download}
            </Button>
            <Link href="/parent/receipts">
              <Button variant="ghost">
                ← {common.buttons.back}
              </Button>
            </Link>
          </div>
        </div>

        {/* Receipt Viewer */}
        <Card>
          <iframe
            srcDoc={receipt.receipt_html}
            className="w-full h-[600px] border border-gray-200 rounded-lg"
            title="Receipt"
          />
        </Card>

        {/* Info */}
        <Card className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-600 font-medium mb-1">
              {data.receiptNo}
            </p>
            <p className="font-semibold text-gray-800">
              {receipt.receipt_number}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 font-medium mb-1">
              {translations.students.singular}
            </p>
            <p className="font-semibold text-gray-800">
              {receipt.student_name}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 font-medium mb-1">
              {data.amount}
            </p>
            <p className="font-semibold text-gray-800">
              ${receipt.amount?.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 font-medium mb-1">
              {data.date}
            </p>
            <p className="font-semibold text-gray-800">
              {new Date(receipt.created_at).toLocaleDateString()}
            </p>
          </div>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="primary"
            fullWidth
            onClick={() => window.print()}
          >
            🖨️ {data.print}
          </Button>
          <Link href="/parent/receipts">
            <Button variant="secondary" fullWidth>
              {common.buttons.backToList}
            </Button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
};

export default ParentReceiptShow;