import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          Icon: CheckCircle2,
          bgColor: 'bg-green-50 border-green-200',
          textColor: 'text-green-800',
          iconColor: 'text-green-500'
        };
      case 'error':
        return {
          Icon: AlertCircle,
          bgColor: 'bg-red-50 border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-500'
        };
      case 'info':
      default:
        return {
          Icon: Info,
          bgColor: 'bg-blue-50 border-blue-200',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-500'
        };
    }
  };

  const { Icon, bgColor, textColor, iconColor } = getToastStyles();

  return (
    <div className={`fixed bottom-8 right-8 z-[100] flex items-center p-5 rounded-xl border-2 shadow-2xl ${bgColor} ${textColor} animate-slide-in-right min-w-[400px] max-w-lg w-full`}>
      <Icon className={`w-8 h-8 flex-shrink-0 mr-4 ${iconColor}`} />
      <div className="flex-1 mr-4">
        <p className="text-base font-bold">{message}</p>
      </div>
      <button 
        onClick={onClose} 
        className="p-1.5 rounded-full hover:bg-black/10 transition-colors focus:outline-none flex-shrink-0"
      >
        <X className="w-5 h-5 opacity-70" />
      </button>
    </div>
  );
}
