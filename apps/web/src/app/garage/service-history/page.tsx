'use client';
import { RoleGuard } from '@/components/common/role-guard';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { DashboardHeader } from '@/components/common/dashboard-header';
import { garageNavItems } from '@/lib/garage-config';
import { Card } from '@/components/common/card';
import { Search, Filter, Eye, Download, Calendar as CalendarIcon } from 'lucide-react';

export default function ServiceHistoryPage() {
  const history = [
    { id: 'INV-2025-1248', customer: 'Ananya Patel', vehicle: 'Toyota Innova • TS08HK2345', details: 'General Service', complaint: 'AC not cooling properly', diagnosis: 'Low refrigerant & dirty condenser', performed: ['AC Gas Refill', 'AC Performance Check', 'Filter Cleaning'], replaced: ['AC Gas (R134a)', 'Cabin Filter'], tech: 'Amit K.', amount: '₹4,850', status: 'Completed', date: '16 May 2025', time: '10:20 AM' },
    { id: 'INV-2025-1247', customer: 'Rahul Verma', vehicle: 'Mahindra XUV700 • TS09KL4567', details: 'Clutch Repair', complaint: 'Clutch slipping', diagnosis: 'Clutch plate worn out', performed: ['Clutch Kit Replacement', 'Gearbox Check', 'Clutch Cable Adjustment'], replaced: ['Clutch Kit', 'Clutch Bearing'], tech: 'Vinay K.', amount: '₹15,860', status: 'Completed', date: '15 May 2025', time: '04:15 PM' },
    { id: 'INV-2025-1246', customer: 'Sanjay Verma', vehicle: 'BMW 320d • TS11PQ3456', details: 'Oil Leakage Repair', complaint: 'Oil leakage from engine', diagnosis: 'Oil seal damage', performed: ['Oil Seal Replacement', 'Engine Cleaning', 'Oil Top-up'], replaced: ['Oil Seal', 'Engine Oil (5W-30)', 'Oil Filter'], tech: 'Manoj', amount: '₹8,430', status: 'Completed', date: '15 May 2025', time: '02:45 PM' },
    { id: 'INV-2025-1245', customer: 'Priya Reddy', vehicle: 'Hyundai i20 • AP39AB5678', details: 'Brake Service', complaint: 'Brake noise', diagnosis: 'Front brake pads worn out', performed: ['Brake Pad Replacement', 'Brake Disc Check', 'Brake Cleaning'], replaced: ['Brake Pads (Front)', 'Brake Cleaner'], tech: 'Suresh K.', amount: '₹7,250', status: 'Completed', date: '15 May 2025', time: '11:30 AM' },
  ];

  return (
    <RoleGuard allowedRoles={['garage']}>
      <DashboardShell customNavItems={garageNavItems} hideBottomWidget={true} header={<DashboardHeader />}>
        <div className="p-6 bg-slate-50 min-h-screen flex gap-6">
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
             <div className="p-5 border-b border-slate-100 flex justify-between items-start">
               <div>
                 <h1 className="text-2xl font-bold text-[#17307a] mb-1">Service History</h1>
                 <p className="text-sm text-slate-500">Complete history of services performed for your customers.</p>
               </div>
               <button className="bg-white text-[#17307a] border px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2"><Download className="w-4 h-4"/> Export</button>
             </div>
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
               <div className="relative w-80">
                 <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                 <input type="text" placeholder="Search by customer, vehicle, invoice or complaint..." className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm bg-slate-50 outline-none focus:ring-1 focus:ring-blue-500" />
               </div>
               <div className="flex gap-3">
                 <select className="border rounded-lg px-3 py-2 text-sm outline-none bg-slate-50 font-medium text-slate-600"><option>All Services</option></select>
                 <select className="border rounded-lg px-3 py-2 text-sm outline-none bg-slate-50 font-medium text-slate-600"><option>All Technicians</option></select>
                 <button className="border rounded-lg px-4 py-2 text-sm outline-none bg-slate-50 font-medium text-slate-600 flex items-center gap-2"><CalendarIcon className="w-4 h-4"/> 01 May 2025 - 16 May 2025</button>
                 <button className="border rounded-lg px-4 py-2 text-sm outline-none bg-slate-50 font-medium text-slate-600 flex items-center gap-2"><Filter className="w-4 h-4"/> Filters</button>
               </div>
             </div>
             <div className="flex-1 overflow-auto">
               <table className="w-full text-left border-collapse min-w-[1200px]">
                 <thead>
                   <tr className="bg-slate-50">
                     <th className="p-4 text-[11px] font-bold text-slate-500 border-b">Invoice ID</th>
                     <th className="p-4 text-[11px] font-bold text-slate-500 border-b">Customer & Vehicle</th>
                     <th className="p-4 text-[11px] font-bold text-slate-500 border-b">Service Details</th>
                     <th className="p-4 text-[11px] font-bold text-slate-500 border-b w-32">Complaint</th>
                     <th className="p-4 text-[11px] font-bold text-slate-500 border-b w-32">Diagnosis</th>
                     <th className="p-4 text-[11px] font-bold text-slate-500 border-b w-48">Services Performed</th>
                     <th className="p-4 text-[11px] font-bold text-slate-500 border-b w-48">Parts Replaced</th>
                     <th className="p-4 text-[11px] font-bold text-slate-500 border-b">Technician</th>
                     <th className="p-4 text-[11px] font-bold text-slate-500 border-b">Date</th>
                     <th className="p-4 text-[11px] font-bold text-slate-500 border-b text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {history.map(h => (
                     <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                       <td className="p-4 align-top"><p className="text-xs font-bold text-blue-600">{h.id}</p><p className="text-[10px] text-slate-400 mt-1">{h.date}</p></td>
                       <td className="p-4 align-top"><div className="flex items-start gap-2"><div className="w-8 h-8 rounded bg-slate-200 mt-1"></div><div><p className="text-sm font-bold text-[#17307a]">{h.customer}</p><p className="text-[11px] font-medium text-slate-700">{h.vehicle.split('•')[0]}</p><p className="text-[10px] text-slate-500">{h.vehicle.split('•')[1]}</p></div></div></td>
                       <td className="p-4 align-top"><p className="text-xs font-bold text-slate-700">{h.details}</p></td>
                       <td className="p-4 align-top"><p className="text-[11px] text-slate-600">{h.complaint}</p></td>
                       <td className="p-4 align-top"><p className="text-[11px] text-slate-600">{h.diagnosis}</p></td>
                       <td className="p-4 align-top"><ul className="text-[10px] text-slate-600 list-disc pl-3 space-y-1">{h.performed.map((p,i)=><li key={i}>{p}</li>)}</ul></td>
                       <td className="p-4 align-top"><ul className="text-[10px] text-slate-600 list-disc pl-3 space-y-1">{h.replaced.map((p,i)=><li key={i}>{p}</li>)}</ul></td>
                       <td className="p-4 align-top"><div className="flex flex-col items-center"><div className="w-6 h-6 rounded bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-bold mb-1">{h.tech.substring(0,2).toUpperCase()}</div><span className="text-[10px] font-bold text-slate-600">{h.tech}</span></div></td>
                       <td className="p-4 align-top text-[10px] text-slate-500"><p>{h.date}</p><p>{h.time}</p><p className="text-xs font-bold text-[#17307a] mt-2">{h.amount}</p></td>
                       <td className="p-4 align-top text-right">
                         <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-600 mb-3 block text-center w-full">{h.status}</span>
                         <div className="flex justify-center gap-2"><button className="text-blue-500 hover:text-blue-700 p-1"><Eye className="w-4 h-4"/></button><button className="text-blue-500 hover:text-blue-700 p-1"><Download className="w-4 h-4"/></button></div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
          
          <div className="w-72 flex flex-col gap-6 flex-shrink-0">
             <Card className="p-5">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-[#17307a]">Service Summary</h3>
                 <span className="text-[10px] font-bold text-slate-500 border px-2 py-1 rounded bg-slate-50">This Month</span>
               </div>
               <div className="space-y-4 text-sm font-bold text-slate-700">
                 <div className="flex justify-between items-center"><span className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-slate-100 flex justify-center items-center text-slate-400 text-[10px]">#</div> Total Services</span> <span>156</span></div>
                 <div className="flex justify-between items-center"><span className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-green-100 flex justify-center items-center text-green-500 text-[10px]">✓</div> Completed</span> <span>132</span></div>
                 <div className="flex justify-between items-center"><span className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-blue-100 flex justify-center items-center text-blue-500 text-[10px]">⏱</div> In Progress</span> <span>18</span></div>
                 <div className="flex justify-between items-center"><span className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-red-100 flex justify-center items-center text-red-500 text-[10px]">⨯</div> Cancelled</span> <span>06</span></div>
                 <a href="#" className="block text-[11px] text-blue-600 font-bold mt-4">View Full Report &rarr;</a>
               </div>
             </Card>
             <Card className="p-5">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-[#17307a]">Top Services</h3>
                 <span className="text-[10px] text-slate-500">This Month</span>
               </div>
               <div className="space-y-3 text-xs font-bold text-slate-600">
                 <div className="flex justify-between items-center"><span className="flex items-center gap-2"><div className="w-5 h-5 rounded border text-blue-500 flex justify-center items-center">🔧</div> General Service</span> <span>46</span></div>
                 <div className="flex justify-between items-center"><span className="flex items-center gap-2"><div className="w-5 h-5 rounded border text-blue-500 flex justify-center items-center">⚙</div> Clutch Repair</span> <span>28</span></div>
                 <div className="flex justify-between items-center"><span className="flex items-center gap-2"><div className="w-5 h-5 rounded border text-blue-500 flex justify-center items-center">🛑</div> Brake Service</span> <span>24</span></div>
                 <div className="flex justify-between items-center"><span className="flex items-center gap-2"><div className="w-5 h-5 rounded border text-blue-500 flex justify-center items-center">🛢</div> Oil Change</span> <span>22</span></div>
                 <div className="flex justify-between items-center"><span className="flex items-center gap-2"><div className="w-5 h-5 rounded border text-blue-500 flex justify-center items-center">❄</div> AC Service</span> <span>18</span></div>
                 <a href="#" className="block text-[11px] text-blue-600 font-bold mt-4">View All Services &rarr;</a>
               </div>
             </Card>
          </div>
        </div>
      </DashboardShell>
    </RoleGuard>
  );
}
