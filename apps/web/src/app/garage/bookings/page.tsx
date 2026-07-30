'use client';
import { RoleGuard } from '@/components/common/role-guard';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { DashboardHeader } from '@/components/common/dashboard-header';
import { garageNavItems } from '@/lib/garage-config';
import { BookingCalendar } from '@/components/garages/ui/reusable-components';

export default function BookingsPage() {
  return (
    <RoleGuard allowedRoles={['garage']}>
      <DashboardShell customNavItems={garageNavItems} hideBottomWidget={true} header={<DashboardHeader />}>
        <div className="p-6 bg-slate-50 min-h-[calc(100vh-64px)]">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#17307a] mb-1">Bookings</h1>
              <p className="text-sm text-slate-500">Manage all your bookings and workshop schedules.</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm">+ New Booking</button>
          </div>
          <BookingCalendar />
        </div>
      </DashboardShell>
    </RoleGuard>
  );
}
