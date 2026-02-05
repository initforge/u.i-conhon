import React from 'react';

interface NotificationBannerProps {
  message: string;
  type?: 'info' | 'warning' | 'success';
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ 
  message, 
  type = 'info' 
}) => {
  const bgColor = {
    info: 'bg-blue-50 border-blue-300 text-blue-700',
    warning: 'bg-yellow-50 border-yellow-300 text-yellow-700',
    success: 'bg-green-50 border-green-300 text-green-700',
  }[type];

  return (
    <div className={`${bgColor} border-2 rounded-lg p-4 mb-6`}>
      <div className="flex items-center space-x-2">
        <span className="text-xl">
          {type === 'info' && 'ℹ️'}
          {type === 'warning' && '⚠️'}
          {type === 'success' && '✓'}
        </span>
        <p className="font-semibold">{message}</p>
      </div>
    </div>
  );
};

export default NotificationBanner;

