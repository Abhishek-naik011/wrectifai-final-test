import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      <div 
        className={cn(
          "relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col",
          className
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-[15px] font-bold text-[#17307a]">{title}</h2>
          <button 
            onClick={onClose} 
            className="rounded-full p-2 text-[#5f7099] hover:bg-[#f4f7ff] hover:text-[#1a56db] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
