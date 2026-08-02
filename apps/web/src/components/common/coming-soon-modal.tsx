import { Modal } from './modal';
import { Sparkles } from 'lucide-react';

export interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
}

export function ComingSoonModal({ isOpen, onClose, featureName }: ComingSoonModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={featureName || "Feature Coming Soon"} className="max-w-sm">
      <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
          <Sparkles className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-[15px] font-bold text-[#17307a] mb-2">We're working on it!</h3>
          <p className="text-sm text-slate-500">
            {featureName ? `The ${featureName} feature` : 'This feature'} is currently under development and will be available in the next release.
          </p>
        </div>
        <button 
          onClick={onClose}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-colors"
        >
          Got it
        </button>
      </div>
    </Modal>
  );
}
