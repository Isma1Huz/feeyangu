import React from 'react';
import { Link } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Button } from '@/components/Common/Button';
import { Card } from '@/components/Common/Card';
import { translations } from '@/lib/data';
import { Receipt } from '@/types/index';

interface ReceiptShowProps {
  receipt: Receipt;
}

const ReceiptShow: React.FC<ReceiptShowProps> = ({ receipt }) => {
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
                window.location.href = `/school/receipts/${receipt.id}/download`;
              }}
            >
              {data.download}
            </Button>
            <Link href="/school/receipts">
              <Button variant="ghost">
                ← {common.buttons.back}
              </Button>
            </Link>
          </div>
        </div>

        {/* Receipt HTML Viewer */}
        <Card>
          <iframe
            srcDoc={receipt.receipt_html}
            className="w-full h-[600px] border border-gray-200 rounded-lg"
            title="Receipt"
          />
        </Card>
      </div>
    </AppLayout>
  );
};

export default ReceiptShow;