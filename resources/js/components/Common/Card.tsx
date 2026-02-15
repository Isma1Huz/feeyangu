import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  onClick?: () => void;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  noPadding = false,
  onClick,
  hover = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-lg shadow-sm border border-gray-200
        ${!noPadding && 'p-6'}
        ${hover && 'hover:shadow-md cursor-pointer transition-shadow duration-200'}
        ${className}
      `}
    >
      {children}
    </div>
  );
};