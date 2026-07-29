'use client';

import { Card } from '@/components/common/card';
import { Users, Wrench, CheckCircle, Clock } from 'lucide-react';

export default function AdminDashboardPage() {
  const stats = [
    { label: 'Total Users', value: '1,248', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Garages', value: '42', icon: Wrench, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Completed Requests', value: '8,421', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pending Quotes', value: '124', icon: Clock, color: 'text-teal-600', bg: 'bg-teal-50' },
  ];

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-bold text-[#17307a]">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of platform activity and metrics</p>
      </div>

      {/* Top Row: Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6 flex flex-col items-center justify-center text-center space-y-3 h-36 border border-gray-100 shadow-sm">
            <div className={`p-3 ${stat.bg} rounded-full ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Platform Activity Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2 border border-gray-100 shadow-sm h-80 flex items-center justify-center">
          <p className="text-sm text-gray-400">Platform Activity Chart Placeholder</p>
        </Card>
        <Card className="p-6 border border-gray-100 shadow-sm h-80 flex flex-col">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Users</h3>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-gray-400">Recent Users List Placeholder</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
