'use client';

import { RoleGuard } from '@/components/common/role-guard';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { Card } from '@/components/common/card';
import { garageNavItems } from '@/lib/garage-config';
import { DashboardHeader } from '@/components/common/dashboard-header';
import { Inbox, Clock, CheckCircle, XCircle, CheckSquare, FileText } from 'lucide-react';

export default function GarageDashboard() {
  const stats = [
    { label: 'Incoming Requests', value: '12', icon: Inbox, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending', value: '4', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Accepted', value: '8', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Completed', value: '52', icon: CheckSquare, color: 'text-teal-600', bg: 'bg-teal-50' },
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
              <Card key={stat.label} className="p-6 flex flex-col items-center justify-center text-center space-y-3 h-36 border border-gray-100 shadow-sm">
                <div className={`p-3 ${stat.bg} rounded-full ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#17307a] text-sm">{stat.label}</h3>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Middle Row: Line Chart Placeholder */}
          <div className="pt-2">
            <h2 className="text-lg font-semibold text-[#17307a] mb-4">Requests This Week</h2>
            <Card className="p-8 flex flex-col items-center justify-center text-center text-gray-400 border border-gray-100 bg-white min-h-[250px]">
              <div className="relative w-full h-32 border-b-2 border-l-2 border-gray-200 flex items-end justify-between px-4 pb-2">
                <div className="w-2 h-10 bg-blue-300 rounded-full"></div>
                <div className="w-2 h-16 bg-blue-400 rounded-full"></div>
                <div className="w-2 h-12 bg-blue-300 rounded-full"></div>
                <div className="w-2 h-20 bg-blue-500 rounded-full"></div>
                <div className="w-2 h-24 bg-blue-600 rounded-full"></div>
                <div className="w-2 h-14 bg-blue-400 rounded-full"></div>
                <div className="w-2 h-28 bg-blue-600 rounded-full"></div>
                <svg className="absolute inset-0 h-full w-full opacity-50" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <polyline points="5,70 20,50 35,65 50,35 65,25 80,60 95,15" fill="none" stroke="#3b82f6" strokeWidth="2" />
                </svg>
              </div>
              <p className="text-sm mt-6 max-w-sm">Line chart visualizing daily requests will appear here.</p>
            </Card>
          </div>

          {/* Bottom Row: Donut Chart & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            {/* Donut Chart Placeholder */}
            <div className="flex flex-col h-full">
              <h2 className="text-lg font-semibold text-[#17307a] mb-4">Accepted vs Rejected</h2>
              <Card className="flex-1 p-8 flex flex-col items-center justify-center text-center text-gray-400 border border-gray-100 bg-white min-h-[250px]">
                <div className="relative w-32 h-32 rounded-full border-[12px] border-green-400 border-r-red-400 flex items-center justify-center mb-4">
                  <div className="text-[#17307a] font-bold text-xl">66%</div>
                </div>
                <p className="text-sm mt-2 max-w-sm">Donut chart visualizing acceptance rate will appear here.</p>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="flex flex-col h-full">
              <h2 className="text-lg font-semibold text-[#17307a] mb-4">Recent Activity</h2>
              <Card className="flex-1 p-6 border border-gray-100 bg-white min-h-[250px]">
                <ul className="space-y-4">
                  <li className="flex items-center gap-4 border-b border-gray-50 pb-3">
                    <div className="h-2 w-2 rounded-full bg-orange-400 shrink-0"></div>
                    <div>
                      <p className="text-sm font-semibold text-[#17307a]">Honda City <span className="text-gray-500 font-normal">- Brake Issue</span></p>
                      <p className="text-xs text-orange-500 font-medium">Pending</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-4 border-b border-gray-50 pb-3">
                    <div className="h-2 w-2 rounded-full bg-green-500 shrink-0"></div>
                    <div>
                      <p className="text-sm font-semibold text-[#17307a]">Hyundai i20 <span className="text-gray-500 font-normal">- AC Cooling</span></p>
                      <p className="text-xs text-green-600 font-medium">Accepted</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-teal-500 shrink-0"></div>
                    <div>
                      <p className="text-sm font-semibold text-[#17307a]">Swift <span className="text-gray-500 font-normal">- Engine Noise</span></p>
                      <p className="text-xs text-teal-600 font-medium">Completed</p>
                    </div>
                  </li>
                </ul>
              </Card>
            </div>
          </div>

        </div>
      </DashboardShell>
    </RoleGuard>
  );
}
