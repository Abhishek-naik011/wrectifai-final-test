'use client';
import { RoleGuard } from '@/components/common/role-guard';
import { Card } from '@/components/common/card';
import { Users, Building2, ClipboardCheck, CalendarRange, ChevronRight, MoreVertical, Search, Bell, MessageSquare, Plus, FileText, CheckCircle2, Activity } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
        <div>
           <h1 className="text-2xl font-bold text-[#17307a] mb-1 flex items-center gap-2">Welcome back, Admin! 👋</h1>
           <p className="text-sm text-slate-500">Here's what's happening on WrectifAI today.</p>
        </div>
        <div className="flex gap-4">
           <div className="flex items-center gap-2"><div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">📊</div></div>
           <div className="flex items-center gap-2"><div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">📈</div></div>
           <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2"><Plus className="w-4 h-4"/> Register Garage</button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><Users className="w-6 h-6"/></div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-0.5">Total Customers</p>
            <p className="text-2xl font-black text-[#17307a]">2,548</p>
            <p className="text-[10px] font-bold text-green-500 flex items-center gap-1">↑ 24 Today</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center"><Building2 className="w-6 h-6"/></div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-0.5">Registered Garages</p>
            <p className="text-2xl font-black text-[#17307a]">146</p>
            <p className="text-[10px] font-bold text-green-500 flex items-center gap-1">↑ 3 This Week</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4 border-orange-200">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center"><ClipboardCheck className="w-6 h-6"/></div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-0.5">Pending Approvals</p>
            <p className="text-2xl font-black text-[#17307a]">12</p>
            <p className="text-[10px] font-bold text-orange-500">Action Required</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center"><CalendarRange className="w-6 h-6"/></div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-0.5">Active Bookings</p>
            <p className="text-2xl font-black text-[#17307a]">321</p>
            <p className="text-[10px] font-bold text-green-500 flex items-center gap-1">● Live</p>
          </div>
        </Card>
      </div>

      <div className="flex gap-6 mb-6">
        <div className="flex-1">
           <Card className="p-5 mb-6">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[#17307a]">Pending Garage Approvals</h3>
                <a href="/admin/garages/pending-approvals" className="text-xs text-blue-600 font-bold">View All</a>
             </div>
             <div className="flex gap-4 overflow-hidden">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex-1 border rounded-xl p-4 bg-white relative">
                    <div className="absolute top-0 right-0 bg-orange-100 text-orange-600 text-[9px] font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-xl">NEW</div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100"></div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 leading-tight">{i===1 ? 'Metro Auto Bay' : i===2 ? 'SpeedFix Auto Care' : 'QuickPit Service Center'}</p>
                        <p className="text-[10px] text-slate-500">Owner: {i===1 ? 'Rahul Sharma' : i===2 ? 'Priya Reddy' : 'Karthik Varma'}</p>
                      </div>
                    </div>
                    <div className="space-y-1 mb-4">
                      <p className="text-[10px] text-slate-600 flex items-center gap-1"><span className="text-slate-400">📍</span> {i===3 ? 'Secunderabad' : 'Hyderabad'}</p>
                      <p className="text-[10px] text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Documents Verified</p>
                    </div>
                    <p className="text-[9px] text-slate-400 mb-3">Submitted: Today, {i===1 ? '10:30 AM' : i===2 ? '09:15 AM' : '06:45 PM'}</p>
                    <div className="grid grid-cols-3 gap-2">
                       <button className="border border-slate-200 text-blue-600 rounded text-[10px] font-bold py-1.5 hover:bg-slate-50">View</button>
                       <button className="bg-green-50 text-green-600 rounded text-[10px] font-bold py-1.5 hover:bg-green-100">Approve</button>
                       <button className="bg-red-50 text-red-600 rounded text-[10px] font-bold py-1.5 hover:bg-red-100">Reject</button>
                    </div>
                  </div>
                ))}
             </div>
           </Card>

           <div className="grid grid-cols-3 gap-6">
             <Card className="p-5 col-span-1">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-[#17307a]">Recent Activity</h3>
                 <a href="#" className="text-xs text-blue-600 font-bold">View All</a>
               </div>
               <div className="space-y-4 pl-4 relative before:absolute before:inset-0 before:ml-1 before:h-full before:w-px before:bg-slate-100">
                 <div className="relative">
                   <div className="absolute w-2 h-2 rounded-full bg-green-500 -left-4 top-1"></div>
                   <p className="text-xs font-bold text-slate-700">Metro Auto Bay approved</p>
                   <p className="text-[10px] text-slate-500">Approved by Admin</p>
                   <p className="text-[9px] text-slate-400">10:45 AM</p>
                 </div>
                 <div className="relative">
                   <div className="absolute w-2 h-2 rounded-full bg-blue-500 -left-4 top-1"></div>
                   <p className="text-xs font-bold text-slate-700">New Customer Registered</p>
                   <p className="text-[10px] text-slate-500">Rahul Kumar from Hyderabad</p>
                   <p className="text-[9px] text-slate-400">09:30 AM</p>
                 </div>
                 <div className="relative">
                   <div className="absolute w-2 h-2 rounded-full bg-green-500 -left-4 top-1"></div>
                   <p className="text-xs font-bold text-slate-700">Booking Completed</p>
                   <p className="text-[10px] text-slate-500">Service completed at SpeedFix Auto Care</p>
                   <p className="text-[9px] text-slate-400">Yesterday</p>
                 </div>
               </div>
             </Card>

             <Card className="p-5 col-span-2 flex gap-6">
                <div className="flex-1">
                   <div className="flex justify-between items-center mb-4">
                     <h3 className="font-bold text-[#17307a]">Pending Tasks</h3>
                     <a href="#" className="text-xs text-blue-600 font-bold">View All</a>
                   </div>
                   <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 border border-slate-100">
                         <div className="flex items-center gap-3"><div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center"><Building2 className="w-4 h-4"/></div><p className="text-xs font-bold text-slate-700">Pending Garage Approvals</p></div>
                         <span className="text-xs font-bold text-red-500">12</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 border border-slate-100">
                         <div className="flex items-center gap-3"><div className="w-8 h-8 rounded bg-orange-100 text-orange-600 flex items-center justify-center"><FileText className="w-4 h-4"/></div><p className="text-xs font-bold text-slate-700">Customer Reports</p></div>
                         <span className="text-xs font-bold text-red-500">3</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 border border-slate-100">
                         <div className="flex items-center gap-3"><div className="w-8 h-8 rounded bg-purple-100 text-purple-600 flex items-center justify-center"><MessageSquare className="w-4 h-4"/></div><p className="text-xs font-bold text-slate-700">Support Tickets</p></div>
                         <span className="text-xs font-bold text-red-500">7</span>
                      </div>
                   </div>
                </div>
                <div className="flex-1">
                   <h3 className="font-bold text-[#17307a] mb-4">Platform Overview</h3>
                   <div className="grid grid-cols-2 gap-3">
                      <div className="border rounded-lg p-3 bg-white">
                         <div className="flex items-center gap-2 mb-2"><CalendarRange className="w-4 h-4 text-blue-500"/><p className="text-[10px] font-bold text-slate-500">Today's Bookings</p></div>
                         <p className="text-xl font-bold text-slate-800">68</p>
                         <p className="text-[9px] text-green-500 font-bold">↑ 12% from yesterday</p>
                      </div>
                      <div className="border rounded-lg p-3 bg-white">
                         <div className="flex items-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4 text-green-500"/><p className="text-[10px] font-bold text-slate-500">Completed Services</p></div>
                         <p className="text-xl font-bold text-slate-800">42</p>
                         <p className="text-[9px] text-green-500 font-bold">↑ 8% from yesterday</p>
                      </div>
                      <div className="border rounded-lg p-3 bg-white">
                         <div className="flex items-center gap-2 mb-2"><FileText className="w-4 h-4 text-orange-500"/><p className="text-[10px] font-bold text-slate-500">Pending Quotes</p></div>
                         <p className="text-xl font-bold text-slate-800">29</p>
                         <p className="text-[9px] text-red-500 font-bold">↓ 5% from yesterday</p>
                      </div>
                      <div className="border rounded-lg p-3 bg-white">
                         <div className="flex items-center gap-2 mb-2"><Bell className="w-4 h-4 text-purple-500"/><p className="text-[10px] font-bold text-slate-500">Active Requests</p></div>
                         <p className="text-xl font-bold text-slate-800">53</p>
                         <p className="text-[9px] text-green-500 font-bold">↑ 11% from yesterday</p>
                      </div>
                   </div>
                </div>
             </Card>
           </div>
        </div>

        <div className="w-72 flex-shrink-0">
           <Card className="p-5">
             <h3 className="font-bold text-[#17307a] mb-4">Quick Actions</h3>
             <div className="grid grid-cols-2 gap-3 mb-3">
               <a href="/admin/garages/register" className="border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-blue-50 hover:border-blue-100 transition-colors cursor-pointer group">
                 <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform"><Plus className="w-5 h-5"/></div>
                 <p className="text-xs font-bold text-[#17307a]">Register Garage</p>
                 <p className="text-[9px] text-slate-400 mt-1">Add new garage</p>
               </a>
               <a href="/admin/garages/pending-approvals" className="border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-green-50 hover:border-green-100 transition-colors cursor-pointer group">
                 <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform"><CheckCircle2 className="w-5 h-5"/></div>
                 <p className="text-xs font-bold text-[#17307a]">Approve Garages</p>
                 <p className="text-[9px] text-slate-400 mt-1">Review & approve</p>
               </a>
             </div>
             <div className="grid grid-cols-2 gap-3">
               <div className="border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-purple-50 hover:border-purple-100 transition-colors cursor-pointer group">
                 <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform"><Users className="w-5 h-5"/></div>
                 <p className="text-xs font-bold text-[#17307a]">Manage Customers</p>
                 <p className="text-[9px] text-slate-400 mt-1">View all customers</p>
               </div>
               <div className="border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-orange-50 hover:border-orange-100 transition-colors cursor-pointer group">
                 <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform"><Activity className="w-5 h-5"/></div>
                 <p className="text-xs font-bold text-[#17307a]">View Reports</p>
                 <p className="text-[9px] text-slate-400 mt-1">Platform analytics</p>
               </div>
             </div>
           </Card>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
           <h3 className="font-bold text-[#17307a]">Recently Registered Garages</h3>
           <a href="/admin/garages" className="text-xs text-blue-600 font-bold">View All</a>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="p-4 text-[11px] font-bold text-slate-500">Garage Name</th>
              <th className="p-4 text-[11px] font-bold text-slate-500">Owner</th>
              <th className="p-4 text-[11px] font-bold text-slate-500">City</th>
              <th className="p-4 text-[11px] font-bold text-slate-500">Services</th>
              <th className="p-4 text-[11px] font-bold text-slate-500">Registration Date</th>
              <th className="p-4 text-[11px] font-bold text-slate-500">Status</th>
              <th className="p-4 text-[11px] font-bold text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[1, 2, 3, 4, 5].map(i => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="p-4 text-xs font-bold text-[#17307a]">{i===1 ? 'Metro Auto Bay' : i===2 ? 'SpeedFix Auto Care' : i===3 ? 'QuickPit Service Center' : i===4 ? 'DriveWell Garage' : 'AutoWorks Garage'}</td>
                <td className="p-4 text-xs text-slate-600">{i===1 ? 'Rahul Sharma' : i===2 ? 'Priya Reddy' : i===3 ? 'Karthik Varma' : i===4 ? 'Imran Khan' : 'Sneha Patel'}</td>
                <td className="p-4 text-xs text-slate-600">{i===3 ? 'Secunderabad' : 'Hyderabad'}</td>
                <td className="p-4 text-xs text-slate-600">{i===1||i===3 ? 'Engine, AC, Brakes' : 'General Service, Tyres'}</td>
                <td className="p-4 text-xs text-slate-600">{i<3 ? '30 Jul, 2024' : i<5 ? '29 Jul, 2024' : '28 Jul, 2024'}</td>
                <td className="p-4">
                  {i===5 ? 
                    <span className="bg-green-50 text-green-600 px-2 py-1 rounded text-[10px] font-bold">Approved</span> : 
                    <span className="bg-orange-50 text-orange-600 px-2 py-1 rounded text-[10px] font-bold">Pending</span>
                  }
                </td>
                <td className="p-4 text-xs">
                  <div className="flex gap-2">
                    <button className="text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded">View</button>
                    <button className="text-slate-400 p-1 hover:bg-slate-100 rounded"><MoreVertical className="w-4 h-4"/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
