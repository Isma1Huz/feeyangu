import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { AuthLayout } from '@/components/Layouts/AuthLayout';
import { Button } from '@/components/Common/Button';
import { Input } from '@/components/Common/Input';
import { Select } from '@/components/Common/Select';
import { Alert } from '@/components/Common/Alert';
import { Card } from '@/components/Common/Card';
import { translations } from '@/lib/data';

const Register = () => {
  const data = translations.auth;
  const common = translations.common;
  const [submitError, setSubmitError] = useState('');
  const [step, setStep] = useState(1);

  const roleOptions = [
    { value: 'school-admin', label: data.roleSchoolAdmin },
    { value: 'parent', label: data.roleParent },
  ];

  const { data: formData, setData, post, processing, errors } = useForm({
    role: 'school-admin',
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    school_name: '',
    agree_terms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (step === 1) {
      setStep(2);
      return;
    }

    post('/register', {
      onError: () => {
        setSubmitError(data.registrationFailed);
      },
    });
  };

  return (
    <AuthLayout
      title={data.createAccount}
      subtitle={data.joinFeeyangu}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {submitError && (
          <Alert
            type="error"
            message={submitError}
            onClose={() => setSubmitError('')}
          />
        )}

        {/* Step Indicator */}
        <div className="flex gap-4 mb-8">
          <div
            className={`flex-1 h-1 rounded-full ${
              step >= 1 ? 'bg-cyan-500' : 'bg-gray-300'
            }`}
          />
          <div
            className={`flex-1 h-1 rounded-full ${
              step >= 2 ? 'bg-cyan-500' : 'bg-gray-300'
            }`}
          />
        </div>

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                {data.selectRole}
              </p>
              <Select
                label={data.iAm}
                required
                options={roleOptions}
                value={formData.role}
                onChange={(e) => setData('role', e.target.value)}
                error={errors.role}
              />
            </div>

            {/* Role Benefits */}
            {formData.role === 'school-admin' ? (
              <Card className="bg-blue-50 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">
                  {data.schoolAdminBenefits}
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>✓ {data.benefit1}</li>
                  <li>✓ {data.benefit2}</li>
                  <li>✓ {data.benefit3}</li>
                </ul>
              </Card>
            ) : (
              <Card className="bg-green-50 border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">
                  {data.parentBenefits}
                </h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>✓ {data.parentBenefit1}</li>
                  <li>✓ {data.parentBenefit2}</li>
                  <li>✓ {data.parentBenefit3}</li>
                </ul>
              </Card>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
            >
              {common.buttons.next}
            </Button>
          </div>
        )}

        {/* Step 2: Account Details */}
        {step === 2 && (
          <div className="space-y-6">
            <Input
              label={common.labels.fullName}
              required
              placeholder="Your full name"
              value={formData.name}
              onChange={(e) => setData('name', e.target.value)}
              error={errors.name}
            />

            <Input
              label={common.labels.email}
              type="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setData('email', e.target.value)}
              error={errors.email}
            />

            {formData.role === 'school-admin' && (
              <Input
                label={data.schoolName}
                required
                placeholder="Your school name"
                value={formData.school_name}
                onChange={(e) => setData('school_name', e.target.value)}
                error={errors.school_name}
              />
            )}

            <Input
              label={common.labels.password}
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
              placeholder="Confirm your password"
              value={formData.password_confirmation}
              onChange={(e) => setData('password_confirmation', e.target.value)}
              error={errors.password_confirmation}
            />

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agree_terms}
                onChange={(e) => setData('agree_terms', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 mt-1"
              />
              <span className="text-sm text-gray-700">
                {data.agreeTerms}{' '}
                <Link
                  href="/terms"
                  className="text-cyan-600 hover:text-cyan-700 font-medium"
                >
                  {common.labels.termsOfService}
                </Link>
                {' '}{data.and}{' '}
                <Link
                  href="/privacy"
                  className="text-cyan-600 hover:text-cyan-700 font-medium"
                >
                  {common.labels.privacyPolicy}
                </Link>
              </span>
            </label>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="secondary"
                fullWidth
                size="lg"
                onClick={() => setStep(1)}
              >
                {common.buttons.back}
              </Button>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                loading={processing}
              >
                {data.createAccount}
              </Button>
            </div>
          </div>
        )}

        <div className="text-center">
          <p className="text-sm text-gray-600">
            {data.haveAccount}{' '}
            <Link href="/login" className="text-cyan-600 hover:text-cyan-700 font-medium">
              {data.signIn}
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;