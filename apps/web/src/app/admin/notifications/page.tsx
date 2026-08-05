import { AdminDashboardShell } from '@/components/admin/admin-dashboard-shell';
import { DashboardHeader } from '@/components/common/dashboard-header';
import { Notifications } from '@/components/notifications/notifications';

export default function Page() {
  return (
    <AdminDashboardShell hideBottomWidget={false} header={<DashboardHeader />}>
      <Notifications />
    </AdminDashboardShell>
  );
}
