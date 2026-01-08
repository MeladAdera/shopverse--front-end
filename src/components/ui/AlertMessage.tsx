// 📁 src/components/ui/AlertMessage.tsx
import React from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface AlertMessageProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  onClose: () => void;
}

const AlertMessage: React.FC<AlertMessageProps> = ({
  type,
  title,
  message,
  onClose
}) => {
  console.log('🔍 AlertMessage rendering with:', { type, title, message }); // Add this log
  
  const typeStyles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: CheckCircle,
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: XCircle,
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: XCircle,
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: XCircle,
    },
  };

  const styles = typeStyles[type];
  const Icon = styles.icon;

  return (
    <div className={`p-4 rounded-lg border ${styles.bg} ${styles.border} ${styles.text} mb-4`}>
      <div className="flex items-start">
        <Icon className="h-5 w-5 mt-0.5 mr-3 shrink-0" />
        <div className="flex-1">
          <h4 className="font-semibold">{title}</h4>
          <p className="mt-1 text-sm">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default AlertMessage;