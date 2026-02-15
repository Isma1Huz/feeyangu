import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Button } from '@/components/Common/Button';
import { Badge } from '@/components/Common/Badge';
import { Card } from '@/components/Common/Card';
import { Alert } from '@/components/Common/Alert';
import { Modal } from '@/components/Common/Modal';
import { translations } from '@/lib/data';
import { Payment } from '@/types/index';

interface PaymentShowProps {
  payment: Payment;
  school: any;
  canApprove?: boolean;
}

const PaymentShow: React.FC<PaymentShowProps> = ({
  payment,
  school,
  canApprove = false,
}) => {
  const data = translations.payments;
  const common = translations.common;
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const { post, processing } = useForm({});

  const handleApprove = () => {
    setSubmitError('');
    setSubmitSuccess('');

    post(`/school/payments/${payment.id}/approve`, {
      onSuccess: () => {
        setSubmitSuccess(common.messages.updated);
        setShowApproveModal(false);
        setTimeout(() => {
          window.location.href = '/school/payments';
        }, 1500);
      },
      onError: () => {
        setSubmitError(common.messages.error);
      },
    });
  };

  const handleReject = () => {
    setSubmitError('');
    setSubmitSuccess('');

    post(`/school/payments/${payment.id}/reject`, {
      data: { reason: rejectReason },
      onSuccess: () => {
        setSubmitSuccess(common.messages.updated);
        setShowRejectModal(false);
        setTimeout(() => {
          window.location.href = '/school/payments';
        }, 1500);
      },
      onError: () => {
        setSubmitError(common.messages.error);
      },
    });
  };

  const statusMap: any = {
    pending: 'warning',
    approved: 'info',
    completed: 'success',
    rejected: 'danger',
  };

  return (
    <AppLayout title={data.show}>
      <div className="max-w-2xl mx-auto space-y-6">
        {submitError && (
          <Alert
            type="error"
            message={submitError}
            onClose={() => setSubmitError('')}
          />
        )}

        {submitSuccess && (
          <Alert
            type="success"
            message={submitSuccess}
            onClose={() => setSubmitSuccess('')}
          />
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {data.show}
            </h1>
            <p className="text-gray-600 mt-1">
              {data.reference}: {payment.reference}
            </p>
          </div>
          <div className="flex gap-3">
            {canApprove && payment.payment_status === 'pending' && (
              <>
                <Button
                  variant="primary"
                  onClick={() => setShowApproveModal(true)}
                >
                  {common.buttons.approve}
                </Button>
                <Button
                  variant="danger"
                  onClick={() => setShowRejectModal(true)}
                >
                  {common.buttons.reject}
                </Button>
              </>
            )}
            <Link href="/school/payments">
              <Button variant="ghost">
                ← {common.buttons.back}
              </Button>
            </Link>
          </div>
        </div>

        {/* Payment Details */}
        <Card className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700">
              {data.status}
            </p>
            <Badge
              label={payment.payment_status.charAt(0).toUpperCase() + payment.payment_status.slice(1)}
              variant={statusMap[payment.payment_status] || 'default'}
              size="md"
            />
          </div>

          {/* Student & Fee */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-2">
                {translations.students.singular}
              </p>
              <p className="text-lg font-semibold text-gray-800">
                {payment.student_name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium mb-2">
                {data.fee}
              </p>
              <p className="text-lg font-semibold text-gray-800">
                {payment.fee_name}
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {common.labels.name}
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">
                  {data.amount}
                </p>
                <p className="text-3xl font-bold text-cyan-600">
                  ${payment.amount?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">
                  {data.method}
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  {payment.payment_method?.charAt(0).toUpperCase() + payment.payment_method?.slice(1)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">
                  {data.reference}
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  {payment.reference || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">
                  Paid Date
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  {payment.paid_at
                    ? new Date(payment.paid_at).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {payment.notes && (
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-600 font-medium mb-2">
                {common.labels.notes}
              </p>
              <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">
                {payment.notes}
              </p>
            </div>
          )}
        </Card>

        {/* School Info */}
        <Card className="bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            School Information
          </h3>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-gray-600 font-medium">{school.name}</p>
              <p className="text-gray-500">{school.email}</p>
              <p className="text-gray-500">{school.phone}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Approve Modal */}
      <Modal
        isOpen={showApproveModal}
        title="Approve Payment"
        onClose={() => setShowApproveModal(false)}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowApproveModal(false)}
            >
              {common.buttons.cancel}
            </Button>
            <Button
              variant="primary"
              onClick={handleApprove}
              loading={processing}
            >
              {common.buttons.confirm}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Approve payment of{' '}
            <span className="font-bold">${payment.amount?.toLocaleString()}</span>?
          </p>
          <p className="text-sm text-gray-600">
            This will mark the payment as completed.
          </p>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        title="Reject Payment"
        onClose={() => setShowRejectModal(false)}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowRejectModal(false)}
            >
              {common.buttons.cancel}
            </Button>
            <Button
              variant="danger"
              onClick={handleReject}
              loading={processing}
            >
              {common.buttons.confirm}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Provide a reason for rejecting:
          </p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g., Invalid reference, Amount mismatch"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            rows={4}
          />
        </div>
      </Modal>
    </AppLayout>
  );
};

export default PaymentShow;