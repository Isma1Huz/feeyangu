import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { AuthLayout } from '@/components/Layouts/AuthLayout';
import { Button } from '@/components/Common/Button';
import { Input } from '@/components/Common/Input';
import { Alert } from '@/components/Common/Alert';
import { Card } from '@/components/Common/Card';
import { translations } from '@/lib/data';

interface ResetPasswordProps {
  token: string;
  email: string;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ token, email }) => {
  const data = translations.auth;
  const common = translations.common;
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { data: formData, setData, post, processing, errors } = useForm({
    token: token,
    email: email,
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    post('/reset-password', {
      onSuccess: () => {
        setSubmitted(true);
      },
      onError: () => {
        setSubmitError(data.resetFailed);
      },
    });
  };

  if (submitted) {
    return (
      <AuthLayout
        title={data.passwordReset}
        subtitle={data.passwordResetSuccess}
      >
        <div className="space-y-6">
          <Alert
            type="success"
            message={data.passwordUpdated}
          />

          <Card className="bg-green-50 border border-green-200 text-center py-12">
            <div className="text-4xl mb-4">✓</div>
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              {data.allDone}
            </h3>
            <p className="text-sm text-green-700 mb-6">
              {data.passwordUpdateMessage}
            </p>
            <Link href="/login">
              <Button variant="primary" fullWidth size="lg">
                {data.signInWithNewPassword}
              </Button>
            </Link>
          </Card>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={data.resetPassword}
      subtitle={data.createNewPassword}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {submitError && (
          <Alert
            type="error"
            message={submitError}
            onClose={() => setSubmitError('')}
          />
        )}

        <Input
          label={common.labels.email}
          type="email"
          disabled
          value={formData.email}
          helpText={data.emailVerified}
        />

        <Input
          label={data.newPassword}
          type="password"
          required
          placeholder="At least 8 characters"
          value={formData.password}
          onChange={(e) => setData('password', e.target.value)}
          error={errors.password}
          helpText={data.passwordRequirements}
        />

        <Input
          label={data.confirmPassword}
          type="password"
          required
          placeholder="Confirm your new password"
          value={formData.password_confirmation}
          onChange={(e) => setData('password_confirmation', e.target.value)}
          error={errors.password_confirmation}
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          size="lg"
          loading={processing}
        >
          {data.resetPassword}
        </Button>

        <Link href="/login">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            size="lg"
          >
            {data.backToLogin}
          </Button>
        </Link>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;