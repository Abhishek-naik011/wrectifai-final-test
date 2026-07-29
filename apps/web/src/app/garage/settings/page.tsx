'use client';

import { RoleGuard } from '@/components/common/role-guard';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { Card } from '@/components/common/card';
import { garageNavItems } from '@/lib/garage-config';
import { DashboardHeader } from '@/components/common/dashboard-header';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <RoleGuard allowedRoles={['garage']}>
      <DashboardShell customNavItems={garageNavItems} hideBottomWidget={true} header={<DashboardHeader />}>
        <div className="space-y-6 p-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#17307a]">Settings</h1>
            <p className="text-sm text-gray-500">Configure your account and notification preferences</p>
          </div>

          <Card className="p-16 flex flex-col items-center justify-center text-center border border-gray-100 bg-white shadow-sm min-h-[50vh]">
            <div className="h-20 w-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
              <Settings className="h-10 w-10" />
            </div>
            <h2 className="text-xl font-bold text-[#17307a] mb-2">Garage settings will be available here</h2>
            <p className="text-gray-500 max-w-md">
              You will be able to manage your security, notification preferences, and team access.
            </p>
          </Card>
        </div>
      </DashboardShell>
    </RoleGuard>
  );
}
