'use client';

import { DashboardShell } from '@/components/home/dashboard-shell';
import { TopNavbar } from '@/components/home/top-navbar';
import { Notifications } from '@/components/notifications/notifications';

export function NotificationsPage() {
  return (
    <DashboardShell>
      <TopNavbar />
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        <Notifications />
      </div>
    </DashboardShell>
  );
}

export default NotificationsPage;
