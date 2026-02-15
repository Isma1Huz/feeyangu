import React from 'react';
import { Link } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Button } from '@/components/Common/Button';
import { Card } from '@/components/Common/Card';
import { Badge } from '@/components/Common/Badge';
import { translations } from '@/lib/data';

interface ReceiptTemplatesIndexProps {
  templates: Array<{
    id: number;
    name: string;
    is_default: boolean;
    is_active: boolean;
    created_at: string;
  }>;
}

const ReceiptTemplatesIndex: React.FC<ReceiptTemplatesIndexProps> = ({
  templates,
}) => {
  const data = translations.receiptTemplates;
  const common = translations.common;

  return (
    <AppLayout title={data.list}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">{data.list}</h1>
          <Link href="/school/receipt-templates/create">
            <Button variant="primary" size="lg">
              + {data.create}
            </Button>
          </Link>
        </div>

        {/* Info Card */}
        <Card className="bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-800">
            💡 {data.templateInfo}
          </p>
        </Card>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates && templates.length > 0 ? (
            templates.map((template) => (
              <Card key={template.id} className="space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {template.name}
                  </h3>
                  {template.is_default && (
                    <Badge
                      label="Default"
                      variant="info"
                      size="sm"
                    />
                  )}
                </div>

                <div className="flex gap-2">
                  <Badge
                    label={template.is_active ? common.buttons.active : common.buttons.inactive}
                    variant={template.is_active ? 'success' : 'default'}
                    size="sm"
                  />
                </div>

                <p className="text-xs text-gray-500">
                  {data.createdDate}: {new Date(template.created_at).toLocaleDateString()}
                </p>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <Button variant="secondary" size="sm" fullWidth>
                    {common.buttons.preview}
                  </Button>
                  <Button variant="ghost" size="sm" fullWidth>
                    {common.buttons.edit}
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 mb-4">{data.noTemplates}</p>
              <Link href="/school/receipt-templates/create">
                <Button variant="primary">
                  {data.createDefault}
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Back Button */}
        <Link href="/school/receipts">
          <Button variant="ghost">
            ← {common.buttons.back}
          </Button>
        </Link>
      </div>
    </AppLayout>
  );
};

export default ReceiptTemplatesIndex;