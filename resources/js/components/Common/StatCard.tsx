import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  backgroundColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  change,
  trend = 'neutral',
  backgroundColor = 'bg-gradient-to-br from-cyan-50 to-blue-50',
}) => {
  return (
    <div
      className={`rounded-lg p-6 border border-gray-200 ${backgroundColor}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
          {change !== undefined && (
            <p
              className={`text-sm mt-2 ${
                trend === 'up'
                  ? 'text-green-600'
                  : trend === 'down'
                  ? 'text-red-600'
                  : 'text-gray-600'
              }`}
            >
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {Math.abs(change)}%
            </p>
          )}
        </div>
        {icon && <div className="text-3xl text-cyan-600">{icon}</div>}
      </div>
    </div>
  );
};