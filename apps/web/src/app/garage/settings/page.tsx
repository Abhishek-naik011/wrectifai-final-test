'use client';
import { RoleGuard } from '@/components/common/role-guard';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { DashboardHeader } from '@/components/common/dashboard-header';
import { garageNavItems } from '@/lib/garage-config';
import { SettingsContent } from '@/pages/settings/settings-content';

export default function SettingsPage() {
  return (
    <RoleGuard allowedRoles={['garage']}>
      <DashboardShell customNavItems={garageNavItems} hideBottomWidget={true} header={<DashboardHeader />}>
        <SettingsContent />
      </DashboardShell>
    </RoleGuard>
  );
}
