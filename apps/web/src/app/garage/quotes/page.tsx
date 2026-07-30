'use client';
import { RoleGuard } from '@/components/common/role-guard';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { DashboardHeader } from '@/components/common/dashboard-header';
import { garageNavItems } from '@/lib/garage-config';
import { Card } from '@/components/common/card';
import { GarageSummaryCard } from '@/components/garages/ui/reusable-components';
import { Search, Plus, Filter, Eye, Download, MoreVertical, FileEdit, Send } from 'lucide-react';

export default function QuotesPage() {
  const quotes = [
    { id: 'Q-2024-1256', customer: 'Ananya Patel', vehicle: 'Toyota Innova • TS08HK2345', details: 'AC Repair & Gas Refill', detailsSub: 'AC not cooling properly', amount: '₹21,450', labour: '₹4,500', parts: '₹16,950', status: 'Sent', date: '16 May 2025', time: '10:20 AM' },
    { id: 'Q-2024-1255', customer: 'Rahul Verma', vehicle: 'Mahindra XUV700 • TS09KL4567', details: 'Clutch Replacement', detailsSub: 'Clutch slipping', amount: '₹15,860', labour: '₹5,000', parts: '₹10,860', status: 'Accepted', date: '15 May 2025', time: '04:15 PM' },
    { id: 'Q-2024-1254', customer: 'Sanjay Verma', vehicle: 'BMW 320d • TS11PQ3456', details: 'Oil Leakage Repair', detailsSub: 'Engine oil leakage', amount: '₹8,430', labour: '₹3,200', parts: '₹5,230', status: 'Sent', date: '15 May 2025', time: '02:45 PM' },
    { id: 'Q-2024-1253', customer: 'Priya Reddy', vehicle: 'Hyundai i20 • AP39AB5678', details: 'Brake Pad Replacement', detailsSub: 'Brake noise', amount: '₹7,250', labour: '₹2,000', parts: '₹5,250', status: 'Rejected', date: '15 May 2025', time: '11:30 AM' },
    { id: 'Q-2024-1252', customer: 'Karthik R.', vehicle: 'Volkswagen Polo • TS13TU2345', details: 'Tyre Rotation & Balancing', detailsSub: 'Vibration in steering', amount: '₹3,100', labour: '₹1,200', parts: '₹1,900', status: 'Accepted', date: '14 May 2025', time: '06:20 PM' },
    { id: 'Q-2024-1251', customer: 'Neha Singh', vehicle: 'Honda City • TS07CG9012', details: 'General Service', detailsSub: 'Periodic maintenance', amount: '₹6,780', labour: '₹2,500', parts: '₹4,280', status: 'Sent', date: '14 May 2025', time: '10:10 AM' },
    { id: 'Q-2024-1250', customer: 'Arjun Mehta', vehicle: 'Maruti Swift • TS10MN7890', details: 'Suspension Repair', detailsSub: 'Suspension noise', amount: '₹9,900', labour: '₹3,000', parts: '₹6,900', status: 'Draft', date: '13 May 2025', time: '09:30 PM' },
    { id: 'Q-2024-1249', customer: 'Vikram Patel', vehicle: 'Honda Amaze • TS09AB7788', details: 'Battery Replacement', detailsSub: 'Battery dead', amount: '₹5,150', labour: '₹800', parts: '₹4,350', status: 'Sent', date: '13 May 2025', time: '04:50 PM' },
  ];

  return (
    <RoleGuard allowedRoles={['garage']}>
      <DashboardShell customNavItems={garageNavItems} hideBottomWidget={true} header={<DashboardHeader />}>
        <div className="p-6 bg-slate-50 min-h-screen flex gap-6">
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
             <div className="p-5 border-b border-slate-100 flex justify-between items-start">
               <div>
                 <h1 className="text-2xl font-bold text-[#17307a] mb-1">Quotes</h1>
                 <p className="text-sm text-slate-500">Manage all service quotations and customer approvals.</p>
               </div>
               <div className="flex gap-3">
                 <button className="bg-[#17307a] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2"><Plus className="w-4 h-4"/> Create Quote</button>
                 <button className="bg-white text-slate-600 border px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2"><Filter className="w-4 h-4"/> Filters</button>
               </div>
             </div>
             <div className="p-4 border-b border-slate-100 bg-slate-50 flex gap-2">
               <button className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">All Quotes <span className="bg-white text-blue-600 text-[10px] px-1.5 rounded-full ml-1">24</span></button>
               <button className="bg-white text-slate-600 border px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-400"></div> Draft <span className="text-slate-400 text-[10px] ml-1">04</span></button>
               <button className="bg-white text-slate-600 border px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Sent <span className="text-slate-400 text-[10px] ml-1">10</span></button>
               <button className="bg-white text-slate-600 border px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Accepted <span className="text-slate-400 text-[10px] ml-1">06</span></button>
               <button className="bg-white text-slate-600 border px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> Rejected <span className="text-slate-400 text-[10px] ml-1">04</span></button>
             </div>
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
               <div className="relative w-80">
                 <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                 <input type="text" placeholder="Search by customer, vehicle or quote ID..." className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm bg-slate-50 outline-none focus:ring-1 focus:ring-blue-500" />
               </div>
               <div className="flex gap-3">
                 <select className="border rounded-lg px-3 py-2 text-sm outline-none bg-slate-50 font-medium text-slate-600"><option>All Status</option></select>
                 <button className="border rounded-lg px-4 py-2 text-sm outline-none bg-slate-50 font-medium text-slate-600 flex items-center gap-2"><CalendarIcon className="w-4 h-4"/> 01 May 2025 - 16 May 2025</button>
               </div>
             </div>
             <div className="flex-1 overflow-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-slate-50">
                     <th className="p-4 text-xs font-bold text-slate-500 border-b">Quote ID</th>
                     <th className="p-4 text-xs font-bold text-slate-500 border-b">Customer & Vehicle</th>
                     <th className="p-4 text-xs font-bold text-slate-500 border-b">Service Details</th>
                     <th className="p-4 text-xs font-bold text-slate-500 border-b">Amount (₹)</th>
                     <th className="p-4 text-xs font-bold text-slate-500 border-b">Status</th>
                     <th className="p-4 text-xs font-bold text-slate-500 border-b">Created On</th>
                     <th className="p-4 text-xs font-bold text-slate-500 border-b text-center">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {quotes.map(q => (
                     <tr key={q.id} className="hover:bg-slate-50 transition-colors group">
                       <td className="p-4"><div className="flex items-center gap-2"><FileEdit className="w-4 h-4 text-blue-500"/><span className="text-sm font-bold text-blue-600">{q.id}</span></div></td>
                       <td className="p-4"><p className="text-sm font-bold text-[#17307a]">{q.customer}</p><p className="text-[11px] text-slate-500">{q.vehicle}</p></td>
                       <td className="p-4"><p className="text-sm font-bold text-slate-700">{q.details}</p><p className="text-[11px] text-slate-500">{q.detailsSub}</p></td>
                       <td className="p-4"><p className="text-sm font-bold text-[#17307a]">{q.amount}</p><p className="text-[10px] text-slate-500">Labour: {q.labour} <br/> Parts: {q.parts}</p></td>
                       <td className="p-4">
                         <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${q.status === 'Accepted' ? 'bg-green-50 text-green-600' : q.status === 'Sent' ? 'bg-blue-50 text-blue-600' : q.status === 'Rejected' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>{q.status}</span>
                       </td>
                       <td className="p-4"><p className="text-[11px] font-bold text-slate-600">{q.date}</p><p className="text-[10px] text-slate-400">{q.time}</p></td>
                       <td className="p-4 text-center">
                         <div className="flex items-center justify-center gap-2">
                           {q.status === 'Draft' ? (
                             <><button className="p-1.5 rounded-md hover:bg-slate-200 text-blue-600"><FileEdit className="w-4 h-4"/></button><button className="p-1.5 rounded-md hover:bg-slate-200 text-blue-600"><Send className="w-4 h-4"/></button></>
                           ) : (
                             <><button className="p-1.5 rounded-md hover:bg-slate-200 text-blue-600"><Eye className="w-4 h-4"/></button><button className="p-1.5 rounded-md hover:bg-slate-200 text-blue-600"><Download className="w-4 h-4"/></button></>
                           )}
                           <button className="p-1.5 rounded-md hover:bg-slate-200 text-slate-400"><MoreVertical className="w-4 h-4"/></button>
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
          
          <div className="w-80 flex flex-col gap-6 flex-shrink-0">
             <Card className="p-5">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-[#17307a]">Quotes Summary</h3>
                 <span className="text-xs text-slate-500">This Month</span>
               </div>
               <div className="flex items-center gap-4">
                 <div className="w-24 h-24 rounded-full border-[10px] border-r-blue-500 border-t-slate-200 border-l-green-500 border-b-red-500 flex items-center justify-center font-bold text-xl text-slate-700">
                   <div className="text-center">24<div className="text-[10px] font-medium text-slate-400 -mt-1">Total</div></div>
                 </div>
                 <div className="space-y-2 text-xs font-bold text-slate-600 flex-1">
                   <div className="flex items-center justify-between"><span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-400"></div> Draft</span> <span>4</span></div>
                   <div className="flex items-center justify-between"><span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Sent</span> <span>10</span></div>
                   <div className="flex items-center justify-between"><span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Accepted</span> <span>6</span></div>
                   <div className="flex items-center justify-between"><span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> Rejected</span> <span>4</span></div>
                 </div>
               </div>
             </Card>
             <Card className="p-5">
                <h3 className="font-bold text-[#17307a] mb-4">Quote Value Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <span className="text-sm font-medium text-slate-600">Total Quote Value</span>
                    <span className="text-lg font-black text-[#17307a]">₹1,78,920</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-green-600 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Accepted Value</span>
                    <span className="text-md font-bold text-green-600">₹62,510</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-blue-600 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Conversion Rate</span>
                    <span className="text-md font-bold text-slate-800">60%</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <span className="text-sm font-bold text-red-500 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> Avg Quote Value</span>
                    <span className="text-md font-bold text-slate-800">₹7,455</span>
                  </div>
                </div>
             </Card>
             <Card className="p-5">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-[#17307a]">Recent Activities</h3>
                 <span className="text-xs text-blue-600">View All</span>
               </div>
               <div className="space-y-4 relative before:absolute before:inset-0 before:ml-3 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-slate-200 pl-8">
                 <div className="relative">
                   <div className="absolute w-6 h-6 bg-green-100 rounded-full flex items-center justify-center -left-[32px] top-0 text-green-600 border-2 border-white"><CheckCircle className="w-3 h-3"/></div>
                   <p className="text-xs font-medium text-slate-700">Quote Q-2024-1255 <span className="font-bold">accepted</span><br/><span className="text-[10px] text-slate-500">by Rahul Verma</span></p>
                 </div>
                 <div className="relative">
                   <div className="absolute w-6 h-6 bg-red-100 rounded-full flex items-center justify-center -left-[32px] top-0 text-red-600 border-2 border-white"><XCircle className="w-3 h-3"/></div>
                   <p className="text-xs font-medium text-slate-700">Quote Q-2024-1253 <span className="font-bold text-red-500">rejected</span><br/><span className="text-[10px] text-slate-500">by Priya Reddy</span></p>
                 </div>
                 <div className="relative">
                   <div className="absolute w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center -left-[32px] top-0 text-blue-600 border-2 border-white"><Send className="w-3 h-3"/></div>
                   <p className="text-xs font-medium text-slate-700">Quote Q-2024-1256 <span className="font-bold text-blue-600">sent</span><br/><span className="text-[10px] text-slate-500">to Ananya Patel</span></p>
                 </div>
               </div>
             </Card>
          </div>
        </div>
      </DashboardShell>
    </RoleGuard>
  );
}

// Ensure icons used are correctly imported from lucide-react if missing (adding mock for missing ones internally)
import { Calendar as CalendarIcon, CheckCircle, XCircle } from 'lucide-react';
