'use client';
import { SettingsContent } from '@/pages/settings/settings-content';

export default function SettingsPage() {
  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Admin Settings</h1>
      </div>
      <SettingsContent />
    </div>
  );
}
