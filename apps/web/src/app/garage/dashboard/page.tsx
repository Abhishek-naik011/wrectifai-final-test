'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { RoleGuard } from '@/components/common/role-guard';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { Card } from '@/components/common/card';
import { garageNavItems } from '@/lib/garage-config';
import { DashboardHeader } from '@/components/common/dashboard-header';
import { Inbox, CheckCircle, CheckSquare, FileText } from 'lucide-react';

import { fetchGarageStats, GarageStatsResponse } from '@/lib/quotes-api';

export default function GarageDashboard() {
  const [statsData, setStatsData] = useState<GarageStatsResponse | null>(null);

  useEffect(() => {
    fetchGarageStats().then(setStatsData).catch(console.error);
  }, []);

  const stats = [
    { label: 'Incoming Requests', value: statsData?.incoming ?? 0, icon: Inbox, color: 'text-blue-600', bg: 'bg-blue-50', link: '/garage/incoming-requests' },
    { label: 'Active Jobs', value: statsData?.activeJobs ?? 0, icon: CheckCircle, color: 'text-orange-600', bg: 'bg-orange-50', link: '/garage/active-jobs' },
    { label: 'Generated Quotes', value: statsData?.generatedQuotes ?? 0, icon: FileText, color: 'text-green-600', bg: 'bg-green-50', link: '/garage/quotes' },
    { label: 'Completed Jobs', value: statsData?.completed ?? 0, icon: CheckSquare, color: 'text-teal-600', bg: 'bg-teal-50', link: '/garage/completed-jobs' },
  ];

  return (
    <RoleGuard allowedRoles={['garage']}>
      <DashboardShell customNavItems={garageNavItems} hideBottomWidget={true} header={<DashboardHeader />}>
        <div className="space-y-6 p-4">
          <div>
            <h1 className="text-2xl font-bold text-[#17307a]">Garage Dashboard</h1>
            <p className="text-sm text-gray-500">Overview of your operations and requests</p>
          </div>

          {/* Top Row: Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Link key={stat.label} href={stat.link}>
                <Card className="p-6 flex flex-col items-center justify-center text-center space-y-3 h-36 border border-gray-100 shadow-sm hover:border-[#1a56db] transition-colors cursor-pointer">
                  <div className={`p-3 ${stat.bg} rounded-full ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#17307a] text-sm">{stat.label}</h3>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>



        </div>
      </DashboardShell>
    </RoleGuard>
  );
}
