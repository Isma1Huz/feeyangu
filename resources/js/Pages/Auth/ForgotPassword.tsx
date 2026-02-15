import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { AuthLayout } from '@/components/Layouts/AuthLayout';
import { Button } from '@/components/Common/Button';
import { Input } from '@/components/Common/Input';
import { Alert } from '@/components/Common/Alert';
import { Card } from '@/components/Common/Card';
import { translations } from '@/lib/data';

interface ForgotPasswordProps {
  status?: string;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ status }) => {
  const data = translations.auth;
  const common = translations.common;
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(!!status);

  const { data: formData, setData, post, processing, errors } = useForm({
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    post('/forgot-password', {
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
        title={data.checkEmail}
        subtitle={data.passwordResetSent}
      >
        <div className="space-y-6">
          <Alert
            type="success"
            message={data.resetLinkSent}
          />

          <Card className="bg-blue-50 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3">
              {common.labels.whatNext}
            </h3>
            <ol className="space-y-2 text-sm text-blue-800">
              <li>1. {data.step1}</li>
              <li>2. {data.step2}</li>
              <li>3. {data.step3}</li>
            </ol>
          </Card>

          <Card className="bg-yellow-50 border border-yellow-200">
            <p className="text-sm text-yellow-800">
              ⏱️ {data.linkExpires}
            </p>
          </Card>

          <Link href="/login">
            <Button variant="primary" fullWidth size="lg">
              {data.backToLogin}
            </Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={data.forgotPassword}
      subtitle={data.resetPasswordSubtitle}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {submitError && (
          <Alert
            type="error"
            message={submitError}
            onClose={() => setSubmitError('')}
          />
        )}

        <Card className="bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-800">
            {data.resetInstructions}
          </p>
        </Card>

        <Input
          label={common.labels.email}
          type="email"
          required
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => setData('email', e.target.value)}
          error={errors.email}
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          size="lg"
          loading={processing}
        >
          {data.sendResetLink}
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

        <p className="text-center text-sm text-gray-600">
          {data.haveAccount}{' '}
          <Link href="/login" className="text-cyan-600 hover:text-cyan-700 font-medium">
            {data.signIn}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;