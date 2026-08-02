const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/app/admin/dashboard/page.tsx');
let content = `
'use client';
import { RoleGuard } from '@/components/common/role-guard';
import { Card } from '@/components/common/card';
import { Users, Building2, ClipboardCheck, CalendarRange, ChevronRight, MoreVertical, Search, Bell, MessageSquare, Plus, FileText, CheckCircle2, Activity, MapPin } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ totalCustomers: 0, registeredGarages: 0, pendingApprovals: 0, activeBookings: 0 });
  const [garages, setGarages] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const statsData = await apiClient.get<any>('/admin/stats').catch(() => ({ totalCustomers: 0, registeredGarages: 0, pendingApprovals: 0, activeBookings: 0 }));
        setStats(statsData);
        
        const garagesData = await apiClient.get<any[]>('/admin/onboarding/garages').catch(() => []);
        setGarages(garagesData);
      } catch (err) {
        console.error('Failed to load admin data', err);
      }
    }
    loadData();
  }, []);

  const pendingGarages = garages.filter(g => g.approvalStatus === 'pending').slice(0, 3);
  const recentGarages = garages.slice(0, 5);

  const formatTime = (isoString: string) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleApprove = async (id: string) => {
    try {
      await apiClient.post(\`/admin/onboarding/garages/\${id}/approve\`, {});
      const garagesData = await apiClient.get<any[]>('/admin/onboarding/garages');
      setGarages(garagesData);
    } catch (err) {
      console.error('Failed to approve garage', err);
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
        <div>
           <h1 className="text-2xl font-bold text-[#17307a] mb-1 flex items-center gap-2">Welcome back, Admin!</h1>
           <p className="text-sm text-slate-500">Here's what's happening on WrectifAI today.</p>
        </div>
        <div className="flex gap-4">
           <Link href="/admin/garages/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 hover:bg-blue-700 transition-colors"><Plus className="w-4 h-4"/> Register Garage</Link>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><Users className="w-6 h-6"/></div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-0.5">Total Customers</p>
            <p className="text-2xl font-black text-[#17307a]">{stats.totalCustomers}</p>
            <p className="text-[10px] font-bold text-green-500 flex items-center gap-1">↑ Active</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center"><Building2 className="w-6 h-6"/></div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-0.5">Registered Garages</p>
            <p className="text-2xl font-black text-[#17307a]">{stats.registeredGarages}</p>
            <p className="text-[10px] font-bold text-green-500 flex items-center gap-1">↑ Active</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4 border-orange-200">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center"><ClipboardCheck className="w-6 h-6"/></div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-0.5">Pending Approvals</p>
            <p className="text-2xl font-black text-[#17307a]">{stats.pendingApprovals}</p>
            {stats.pendingApprovals > 0 ? (
              <p className="text-[10px] font-bold text-orange-500">Action Required</p>
            ) : (
              <p className="text-[10px] font-bold text-green-500">All caught up</p>
            )}
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center"><CalendarRange className="w-6 h-6"/></div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-0.5">Active Bookings</p>
            <p className="text-2xl font-black text-[#17307a]">{stats.activeBookings}</p>
            <p className="text-[10px] font-bold text-green-500 flex items-center gap-1">Live</p>
          </div>
        </Card>
      </div>

      <div className="flex gap-6 mb-6">
        <div className="flex-1 w-full max-w-full">
           <Card className="p-5 mb-6">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[#17307a]">Pending Garage Approvals</h3>
                <Link href="/admin/garages/pending-approvals" className="text-xs text-blue-600 font-bold">View All</Link>
             </div>
             <div className="flex gap-4 overflow-hidden">
                {pendingGarages.length === 0 ? (
                  <p className="text-sm text-slate-500 p-4">No pending garage approvals at the moment.</p>
                ) : (
                  pendingGarages.map((g, idx) => (
                    <div key={g.id} className="flex-1 border rounded-xl p-4 bg-white relative">
                      {idx === 0 && <div className="absolute top-0 right-0 bg-orange-100 text-orange-600 text-[9px] font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-xl">NEW</div>}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100"></div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 leading-tight">{g.name}</p>
                          <p className="text-[10px] text-slate-500">Owner: {g.ownerName || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="space-y-1 mb-4">
                        <p className="text-[10px] text-slate-600 flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {g.city || 'N/A'}</p>
                        <p className="text-[10px] text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Documents Under Review</p>
                      </div>
                      <p className="text-[9px] text-slate-400 mb-3">Submitted: {formatTime(g.createdAt)}</p>
                      <div className="grid grid-cols-3 gap-2">
                         <Link href="/coming-soon" className="border border-slate-200 text-blue-600 rounded text-[10px] font-bold py-1.5 hover:bg-slate-50 text-center">View</Link>
                         <button onClick={() => handleApprove(g.id)} className="bg-green-50 text-green-600 rounded text-[10px] font-bold py-1.5 hover:bg-green-100">Approve</button>
                         <Link href="/coming-soon" className="bg-red-50 text-red-600 rounded text-[10px] font-bold py-1.5 hover:bg-red-100 text-center">Reject</Link>
                      </div>
                    </div>
                  ))
                )}
             </div>
           </Card>
           
           <div className="grid grid-cols-3 gap-6">
             <Card className="p-5 col-span-1">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-[#17307a]">Recent Activity</h3>
                 <Link href="/coming-soon" className="text-xs text-blue-600 font-bold">View All</Link>
               </div>
               <div className="space-y-4 pl-4 relative before:absolute before:inset-0 before:ml-1 before:h-full before:w-px before:bg-slate-100">
                 <p className="text-xs text-slate-500">No recent activity</p>
               </div>
             </Card>

             <Card className="p-5 col-span-2 flex gap-6">
                <div className="flex-1">
                   <div className="flex justify-between items-center mb-4">
                     <h3 className="font-bold text-[#17307a]">Pending Tasks</h3>
                     <Link href="/coming-soon" className="text-xs text-blue-600 font-bold">View All</Link>
                   </div>
                   <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 border border-slate-100">
                         <div className="flex items-center gap-3"><div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center"><Building2 className="w-4 h-4"/></div><p className="text-xs font-bold text-slate-700">Pending Garage Approvals</p></div>
                         <span className="text-xs font-bold text-red-500">{stats.pendingApprovals}</span>
                      </div>
                   </div>
                </div>
                <div className="flex-1">
                   <h3 className="font-bold text-[#17307a] mb-4">Platform Overview</h3>
                   <div className="grid grid-cols-2 gap-3">
                      <div className="border rounded-lg p-3 bg-white">
                         <div className="flex items-center gap-2 mb-2"><CalendarRange className="w-4 h-4 text-blue-500"/><p className="text-[10px] font-bold text-slate-500">Total Bookings</p></div>
                         <p className="text-xl font-bold text-slate-800">{stats.activeBookings}</p>
                      </div>
                      <div className="border rounded-lg p-3 bg-white">
                         <div className="flex items-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4 text-green-500"/><p className="text-[10px] font-bold text-slate-500">Garages</p></div>
                         <p className="text-xl font-bold text-slate-800">{stats.registeredGarages}</p>
                      </div>
                   </div>
                </div>
             </Card>
           </div>
        </div>
      </div>
      
      <Card className="p-0 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
           <h3 className="font-bold text-[#17307a]">Recently Registered Garages</h3>
           <Link href="/admin/garages" className="text-xs text-blue-600 font-bold">View All</Link>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="p-4 text-[11px] font-bold text-slate-500">Garage Name</th>
              <th className="p-4 text-[11px] font-bold text-slate-500">Owner</th>
              <th className="p-4 text-[11px] font-bold text-slate-500">City</th>
              <th className="p-4 text-[11px] font-bold text-slate-500">Registration Date</th>
              <th className="p-4 text-[11px] font-bold text-slate-500">Status</th>
              <th className="p-4 text-[11px] font-bold text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {recentGarages.length === 0 ? (
               <tr>
                 <td colSpan={6} className="p-8 text-center text-slate-500 text-sm">No garages registered yet.</td>
               </tr>
            ) : (
               recentGarages.map((g) => (
                 <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                   <td className="p-4">
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded bg-slate-100"></div>
                       <span className="font-bold text-sm text-[#17307a]">{g.name}</span>
                     </div>
                   </td>
                   <td className="p-4 text-sm text-slate-600">{g.ownerName || 'N/A'}</td>
                   <td className="p-4 text-sm text-slate-600">{g.city || 'N/A'}</td>
                   <td className="p-4 text-sm text-slate-500">{formatTime(g.createdAt)}</td>
                   <td className="p-4">
                     <span className={\`px-2.5 py-1 rounded-full text-[10px] font-bold \${
                       g.approvalStatus === 'approved' ? 'bg-green-100 text-green-700' :
                       g.approvalStatus === 'pending' ? 'bg-orange-100 text-orange-700' :
                       'bg-red-100 text-red-700'
                     }\`}>
                       {g.approvalStatus ? g.approvalStatus.charAt(0).toUpperCase() + g.approvalStatus.slice(1) : 'Unknown'}
                     </span>
                   </td>
                   <td className="p-4">
                     <Link href="/coming-soon" className="text-slate-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50">
                       <MoreVertical className="w-4 h-4" />
                     </Link>
                   </td>
                 </tr>
               ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
`;

fs.writeFileSync(file, content, 'utf8');
console.log('Replaced Admin Dashboard content successfully.');
