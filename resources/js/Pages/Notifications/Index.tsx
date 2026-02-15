import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { AppLayout } from '@/components/Layouts/AppLayout';
import { Button } from '@/components/Common/Button';
import { Input } from '@/components/Common/Input';
import { Select } from '@/components/Common/Select';
import { Card } from '@/components/Common/Card';
import { Badge } from '@/components/Common/Badge';
import { Pagination } from '@/components/Common/Pagination';
import { Alert } from '@/components/Common/Alert';
import { translations } from '@/lib/data';
import { PaginatedResponse, Notification } from '@/types/index';

interface NotificationsIndexProps {
  notifications: PaginatedResponse<Notification>;
  filter?: string;
  unreadCount: number;
}

const NotificationsIndex: React.FC<NotificationsIndexProps> = ({
  notifications,
  filter = 'all',
  unreadCount,
}) => {
  const [filterType, setFilterType] = useState(filter);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const data = translations.notifications;
  const common = translations.common;

  const { post, processing } = useForm({});

  const typeMap: Record<string, string> = {
    payment: '💳 Payment',
    fee: '💰 Fee',
    student: '👥 Student',
    term: '📅 Term',
    system: '⚙️ System',
    announcement: '📢 Announcement',
  };

  const typeOptions = [
    { value: 'all', label: `${common.buttons.all} ${data.notifications}` },
    { value: 'unread', label: `${data.unread} (${unreadCount})` },
    { value: 'payment', label: typeMap.payment },
    { value: 'fee', label: typeMap.fee },
    { value: 'student', label: typeMap.student },
  ];

  const handleMarkAsRead = (notificationId: number) => {
    post(`/notifications/${notificationId}/mark-as-read`, {
      onSuccess: () => {
        setSubmitSuccess(common.messages.updated);
      },
    });
  };

  const handleMarkAllAsRead = () => {
    post('/notifications/mark-all-as-read', {
      onSuccess: () => {
        setSubmitSuccess(common.messages.updated);
      },
    });
  };

  const handleDelete = (notificationId: number) => {
    if (window.confirm(common.messages.confirm)) {
      post(`/notifications/${notificationId}`, {
        method: 'delete',
        onSuccess: () => {
          setSubmitSuccess(common.messages.deleted);
        },
      });
    }
  };

  return (
    <AppLayout title={data.notifications}>
      <div className="space-y-6">
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
              {data.notifications}
            </h1>
            {unreadCount > 0 && (
              <p className="text-gray-600 mt-1">
                {data.youHave} {unreadCount} {data.unreadNotifications}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="secondary"
              onClick={handleMarkAllAsRead}
              loading={processing}
            >
              {data.markAllAsRead}
            </Button>
          )}
        </div>

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder={`${common.buttons.search} ${data.notifications}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              options={typeOptions}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            />
            <Button variant="secondary" fullWidth>
              {common.buttons.filter}
            </Button>
          </div>
        </Card>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.data && notifications.data.length > 0 ? (
            notifications.data.map((notification) => (
              <Card
                key={notification.id}
                className={`${
                  !notification.is_read
                    ? 'border-l-4 border-l-cyan-500 bg-cyan-50'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Icon & Content */}
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg"
                      style={{
                        backgroundColor: notification.color || '#f0f9ff',
                      }}
                    >
                      {notification.icon || '📬'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-800">
                          {notification.title}
                        </h3>
                        {!notification.is_read && (
                          <Badge
                            label={data.new}
                            variant="info"
                            size="sm"
                          />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex gap-2">
                    {!notification.is_read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                        loading={processing}
                      >
                        ✓
                      </Button>
                    )}
                    {notification.related_model && notification.related_id && (
                      <Link
                        href={`/${notification.related_model}/${notification.related_id}`}
                      >
                        <Button variant="secondary" size="sm">
                          {common.buttons.view}
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(notification.id)}
                    >
                      🗑️
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">
                📬 {data.noNotifications}
              </p>
              <p className="text-gray-400 text-sm">
                {data.allCaughtUp}
              </p>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {notifications.data && notifications.data.length > 0 && (
          <Pagination
            currentPage={notifications.current_page || 1}
            lastPage={notifications.last_page || 1}
            perPage={notifications.per_page || 15}
            total={notifications.total || 0}
            onPageChange={() => {}}
          />
        )}

        {/* Empty State */}
        {(!notifications.data || notifications.data.length === 0) && (
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {data.greatJob}
              </h3>
              <p className="text-gray-600">
                {data.noNewNotifications}
              </p>
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default NotificationsIndex;