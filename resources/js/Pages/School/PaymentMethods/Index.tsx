import React from 'react';
import { Link } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Button } from '@/components/Common/Button';
import { Card } from '@/components/Common/Card';
import { Badge } from '@/components/Common/Badge';
import { translations } from '@/lib/data';

interface PaymentMethodsIndexProps {
  paymentMethods: Array<{
    id: number;
    method_type: string;
    account_holder_name?: string;
    account_number?: string;
    mpesa_number?: string;
    is_active: boolean;
    display_order: number;
  }>;
}

const PaymentMethodsIndex: React.FC<PaymentMethodsIndexProps> = ({
  paymentMethods,
}) => {
  const data = translations.paymentMethods;
  const common = translations.common;

  const methodTypeLabels: Record<string, string> = {
    mpesa: 'M-Pesa',
    bank_transfer: 'Bank Transfer',
    bank_check: 'Check',
    cash: 'Cash',
    card: 'Card',
    paypal: 'PayPal',
  };

  return (
    <AppLayout title={data.list}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">{data.list}</h1>
          <Link href="/school/payment-methods/create">
            <Button variant="primary" size="lg">
              + {data.create}
            </Button>
          </Link>
        </div>

        {/* Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paymentMethods && paymentMethods.length > 0 ? (
            paymentMethods.map((method) => (
              <Card key={method.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {methodTypeLabels[method.method_type] || method.method_type}
                  </h3>
                  <Badge
                    label={method.is_active ? common.buttons.active : common.buttons.inactive}
                    variant={method.is_active ? 'success' : 'default'}
                  />
                </div>

                {method.account_holder_name && (
                  <div>
                    <p className="text-sm text-gray-600">Account Holder</p>
                    <p className="font-medium text-gray-800">
                      {method.account_holder_name}
                    </p>
                  </div>
                )}

                {method.account_number && (
                  <div>
                    <p className="text-sm text-gray-600">Account Number</p>
                    <p className="font-medium text-gray-800">
                      {method.account_number}
                    </p>
                  </div>
                )}

                {method.mpesa_number && (
                  <div>
                    <p className="text-sm text-gray-600">M-Pesa Number</p>
                    <p className="font-medium text-gray-800">
                      {method.mpesa_number}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <Link href={`/school/payment-methods/${method.id}/edit`}>
                    <Button variant="secondary" size="sm" fullWidth>
                      {common.buttons.edit}
                    </Button>
                  </Link>
                  <Button variant="danger" size="sm" fullWidth>
                    {common.buttons.delete}
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">{data.noMethods}</p>
              <Link href="/school/payment-methods/create" className="mt-4">
                <Button variant="primary">
                  {data.create}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default PaymentMethodsIndex;