'use client';
import { RoleGuard } from '@/components/common/role-guard';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { DashboardHeader } from '@/components/common/dashboard-header';
import { garageNavItems } from '@/lib/garage-config';
import { KanbanBoard } from '@/components/garages/ui/reusable-components';

export default function ActiveJobsPage() {
  return (
    <RoleGuard allowedRoles={['garage']}>
      <DashboardShell customNavItems={garageNavItems} hideBottomWidget={true} header={<DashboardHeader />}>
        <div className="p-6 bg-slate-50 min-h-[calc(100vh-64px)] flex flex-col">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#17307a] mb-1">Active Jobs</h1>
              <p className="text-sm text-slate-500">Track and manage all ongoing jobs in your workshop.</p>
            </div>
            <div className="flex gap-2">
               <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm">Board View</button>
               <button className="bg-white text-slate-600 px-4 py-2 rounded-lg text-sm font-bold border border-slate-200">List View</button>
            </div>
          </div>
          <KanbanBoard />
        </div>
      </DashboardShell>
    </RoleGuard>
  );
}
