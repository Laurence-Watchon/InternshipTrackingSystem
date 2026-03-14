import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const isSuccess = type === 'success';
  const Icon = isSuccess ? CheckCircle2 : AlertCircle;
  const bgColor = isSuccess ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  const textColor = isSuccess ? 'text-green-800' : 'text-red-800';
  const iconColor = isSuccess ? 'text-green-500' : 'text-red-500';

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
