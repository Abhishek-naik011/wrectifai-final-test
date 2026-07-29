'use client';

import { RoleGuard } from '@/components/common/role-guard';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { adminNavItems } from '@/lib/admin-config';
import { DashboardHeader } from '@/components/common/dashboard-header';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['admin']}>
      <DashboardShell customNavItems={adminNavItems} hideBottomWidget={true} header={<DashboardHeader />}>
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
