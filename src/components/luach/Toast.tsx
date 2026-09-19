import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div data-ev-id="ev_6809385510"
    className={`fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in ${
    type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`
    }
    dir="rtl">

      {type === 'success' ? <Check size={18} /> : <X size={18} />}
      <span data-ev-id="ev_1f2c9997ec" className="text-sm">{message}</span>
    </div>);

}