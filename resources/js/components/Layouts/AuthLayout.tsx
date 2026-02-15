import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-white mb-2">Feeyangu</div>
          <p className="text-cyan-100">School Fee Management System</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">{title}</h1>
          {subtitle && (
            <p className="text-gray-600 text-center mb-6">{subtitle}</p>
          )}
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-cyan-100 text-sm mt-6">
          © 2024 Feeyangu. All rights reserved.
        </p>
      </div>
    </div>
  );
};