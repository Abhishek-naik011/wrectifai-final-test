'use client';
import { HelpContent } from '@/pages/help/help-content';

export default function SupportPage() {
  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Admin Support</h1>
      </div>
      <HelpContent />
    </div>
  );
}
