import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { AuthLayout } from '@/components/Layouts/AuthLayout';
import { Button } from '@/components/Common/Button';
import { Input } from '@/components/Common/Input';
import { Alert } from '@/components/Common/Alert';
import { Card } from '@/components/Common/Card';
import { translations } from '@/lib/data';

const Login = () => {
  const data = translations.auth;
  const common = translations.common;
  const [submitError, setSubmitError] = useState('');

  const { data: formData, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    post('/login', {
      onError: () => {
        setSubmitError(data.invalidCredentials);
      },
    });
  };

  return (
    <AuthLayout
      title={data.signIn}
      subtitle={data.welcomeBack}
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
          required
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => setData('email', e.target.value)}
          error={errors.email}
        />

        <Input
          label={common.labels.password}
          type="password"
          required
          placeholder={data.enterPassword}
          value={formData.password}
          onChange={(e) => setData('password', e.target.value)}
          error={errors.password}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.remember}
              onChange={(e) => setData('remember', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
            />
            <span className="text-sm text-gray-700">
              {data.rememberMe}
            </span>
          </label>
          <Link href="/forgot-password" className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">
            {data.forgotPassword}
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          size="lg"
          loading={processing}
        >
          {data.signIn}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              {data.newUser}
            </span>
          </div>
        </div>

        <Link href="/register">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            size="lg"
          >
            {data.createAccount}
          </Button>
        </Link>

        {/* Info Card */}
        <Card className="bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-800">
            💡 <strong>{data.demoAccount}:</strong><br/>
            {data.demoEmail}<br/>
            {data.demoPassword}
          </p>
        </Card>
      </form>
    </AuthLayout>
  );
};

export default Login;