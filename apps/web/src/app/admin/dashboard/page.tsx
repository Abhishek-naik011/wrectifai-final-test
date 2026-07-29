'use client';

import { RoleGuard } from '@/components/common/role-guard';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { Card } from '@/components/common/card';
import Link from 'next/link';
import { adminNavItems } from '@/lib/admin-config';

export default function AdminDashboard() {
  return (
    <RoleGuard allowedRoles={['admin']}>
      <DashboardShell customNavItems={adminNavItems} hideBottomWidget={true}>
        <div className="space-y-6 p-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#17307a]">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome to the WrectifAI Administration Panel</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminNavItems.slice(1).map((item) => (
              <Link href={item.href} key={item.label}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer flex flex-col items-center justify-center text-center space-y-4 h-40">
                  <div className="p-4 bg-[#eef4ff] rounded-full text-[#1a56db]">
                    <item.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold text-[#17307a]">{item.label}</h3>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </DashboardShell>
    </RoleGuard>
  );
}
