'use client';
import { Card } from '@/components/common/card';
import { Search, Filter, Download, MoreVertical, PauseCircle, CheckCircle2, RotateCcw, AlertTriangle, FileWarning, Clock } from 'lucide-react';

export default function SuspendedGaragesPage() {
  const suspendedGarages = [
    { id: 1, name: 'Metro Auto Bay', email: 'metroautobay@gmail.com', phone: '98765 43210', owner: 'Rahul Sharma', city: 'Hyderabad', reason: 'Multiple Policy Violations', reasonDesc: 'Violated platform guidelines 3 times', type: 'Policy', suspended: '30 Jul, 2024 (1 days ago)', by: 'Admin Surabi N' },
    { id: 2, name: 'SpeedFix Auto Care', email: 'speedfix@gmail.com', phone: '91234 56780', owner: 'Priya Reddy', city: 'Hyderabad', reason: 'Invalid Documents', reasonDesc: 'Submitted invalid business license', type: 'Document', suspended: '29 Jul, 2024 (1 days ago)', by: 'Admin Surabi N' },
    { id: 3, name: 'QuickPit Service Center', email: 'quickpit@gmail.com', phone: '99887 76655', owner: 'Karthik Varma', city: 'Secunderabad', reason: 'Fraudulent Activity', reasonDesc: 'Found suspicious transaction pattern', type: 'Fraud', suspended: '28 Jul, 2024 (2 days ago)', by: 'Admin Surabi N' },
    { id: 4, name: 'DriveWell Garage', email: 'drivewell@gmail.com', phone: '90123 45678', owner: 'Imran Khan', city: 'Hyderabad', reason: 'Poor Service Quality', reasonDesc: 'Multiple negative reviews and complaints', type: 'Quality', suspended: '26 Jul, 2024 (4 days ago)', by: 'Admin Surabi N' },
    { id: 5, name: 'AutoWorks Garage', email: 'autoworks@gmail.com', phone: '93456 78901', owner: 'Sneha Patel', city: 'Hyderabad', reason: 'Payment Issues', reasonDesc: 'Failed to settle platform dues', type: 'Payment', suspended: '25 Jul, 2024 (5 days ago)', by: 'Admin Surabi N' },
    { id: 6, name: 'GearUp Garage', email: 'gearup@gmail.com', phone: '9900112233', owner: 'Vikram Singh', city: 'Hyderabad', reason: 'Inappropriate Behavior', reasonDesc: 'Reported unprofessional conduct', type: 'Policy', suspended: '23 Jul, 2024 (7 days ago)', by: 'Admin Surabi N' },
    { id: 7, name: 'Honest Auto Care', email: 'honestauto@gmail.com', phone: '9888997766', owner: 'Arjun Reddy', city: 'Warangal', reason: 'Service Suspension', reasonDesc: 'Temporarily suspended by admin', type: 'Admin', suspended: '22 Jul, 2024 (8 days ago)', by: 'Admin Surabi N' },
    { id: 8, name: 'Prime Garage', email: 'primegarage@gmail.com', phone: '9151515151', owner: 'Manoj Kumar', city: 'Hyderabad', reason: 'Incomplete Verification', reasonDesc: 'Failed to complete verification process', type: 'Document', suspended: '20 Jul, 2024 (10 days ago)', by: 'Admin Surabi N' },
  ];

  const getReasonIcon = (type: string) => {
    switch (type) {
      case 'Document': return <FileWarning className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />;
      case 'Fraud': return <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />;
      case 'Payment': return <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />;
      case 'Policy': 
      case 'Quality': 
      case 'Admin': return <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />;
      default: return <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold text-[#17307a] mb-1">Suspended Garages <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs ml-2">8</span></h1>
           <p className="text-sm text-slate-500">Dashboard &gt; Garage Management &gt; Suspended Garages</p>
        </div>
        <button className="bg-white text-slate-600 border px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 hover:bg-slate-50"><Download className="w-4 h-4"/> Export</button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-5 bg-white border border-red-100 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center"><PauseCircle className="w-6 h-6"/></div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-0.5">Total Suspended</p>
            <p className="text-2xl font-black text-[#17307a]">8</p>
            <p className="text-[10px] font-bold text-red-500">Garages</p>
          </div>
        </Card>
        <Card className="p-5 bg-white border border-orange-100 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center"><div className="text-xl">📅</div></div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-0.5">Suspended This Month</p>
            <p className="text-2xl font-black text-[#17307a]">2</p>
            <p className="text-[10px] font-bold text-green-500">↓ 2 less than last month</p>
          </div>
        </Card>
        <Card className="p-5 bg-white border border-purple-100 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center"><Clock className="w-6 h-6"/></div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-0.5">Avg. Suspension Duration</p>
            <p className="text-2xl font-black text-[#17307a]">18</p>
            <p className="text-[10px] font-bold text-purple-500">Days</p>
          </div>
        </Card>
        <Card className="p-5 bg-white border border-blue-100 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><RotateCcw className="w-6 h-6"/></div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-0.5">Restored This Month</p>
            <p className="text-2xl font-black text-[#17307a]">1</p>
            <p className="text-[10px] font-bold text-green-500">↑ 1 more than last month</p>
          </div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
           <div className="relative w-80">
             <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
             <input type="text" placeholder="Search by garage name, owner, email or phone..." className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm bg-white outline-none focus:ring-1 focus:ring-blue-500" />
           </div>
           <div className="flex gap-3 items-center">
             <select className="border rounded-lg px-3 py-2 text-sm outline-none bg-white font-medium text-slate-600 min-w-[140px]"><option>Select Reason</option></select>
             <select className="border rounded-lg px-3 py-2 text-sm outline-none bg-white font-medium text-slate-600 min-w-[120px]"><option>All Cities</option></select>
             <select className="border rounded-lg px-3 py-2 text-sm outline-none bg-white font-medium text-slate-600 min-w-[120px]"><option>All Services</option></select>
             <button className="bg-white text-slate-600 border px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 hover:bg-slate-50"><Filter className="w-4 h-4"/> More Filters</button>
             <div className="w-px h-8 bg-slate-200 mx-2"></div>
             <select className="border rounded-lg px-3 py-2 text-sm outline-none bg-white font-medium text-slate-600"><option>Sort by: Newest First</option></select>
           </div>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="p-4 w-10 pl-6"><input type="checkbox" className="rounded border-slate-300"/></th>
              <th className="p-4 text-xs font-bold text-slate-500">Garage Details</th>
              <th className="p-4 text-xs font-bold text-slate-500">Owner Details</th>
              <th className="p-4 text-xs font-bold text-slate-500">City</th>
              <th className="p-4 text-xs font-bold text-slate-500 w-64">Reason for Suspension</th>
              <th className="p-4 text-xs font-bold text-slate-500">Suspended Date</th>
              <th className="p-4 text-xs font-bold text-slate-500">Suspended By</th>
              <th className="p-4 text-xs font-bold text-slate-500 text-center pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {suspendedGarages.map(g => (
              <tr key={g.id} className="hover:bg-slate-50 bg-white">
                <td className="p-4 pl-6"><input type="checkbox" className="rounded border-slate-300"/></td>
                <td className="p-4">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full border border-slate-100 bg-white flex items-center justify-center p-1 overflow-hidden flex-shrink-0 text-xs text-center font-bold text-[#17307a]">{g.name.split(' ')[0]}</div>
                    <div>
                      <p className="text-sm font-bold text-[#17307a] leading-tight mb-0.5">{g.name}</p>
                      <p className="text-[10px] text-slate-500">{g.email}</p>
                      <p className="text-[10px] text-slate-500">{g.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-xs font-bold text-slate-700 leading-tight flex items-center gap-1 mb-0.5"><span className="text-slate-400">👤</span> {g.owner}</p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1">✉ {g.email.split('@')[0]}@gmail.com</p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1">📞 {g.phone}</p>
                </td>
                <td className="p-4 text-xs text-slate-600">{g.city}</td>
                <td className="p-4">
                   <div className="flex gap-2 items-start">
                      {getReasonIcon(g.type)}
                      <div>
                        <p className="text-[11px] font-bold text-slate-800 leading-tight">{g.reason}</p>
                        <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{g.reasonDesc}</p>
                      </div>
                   </div>
                </td>
                <td className="p-4 text-xs text-slate-600">
                   <p className="text-[11px] font-bold text-slate-700 flex items-center gap-1 mb-0.5"><span className="text-slate-400">📅</span> {g.suspended.split('(')[0]}</p>
                   <p className="text-[10px] text-slate-500 flex items-center gap-1"><span className="text-slate-400">🕒</span> {g.suspended.split('(')[1].replace(')', '')}</p>
                </td>
                <td className="p-4">
                   <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><CheckCircle2 className="w-3 h-3"/></div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-700 leading-tight">{g.by.split(' ')[0]}</p>
                        <p className="text-[10px] text-slate-500">{g.by.split(' ')[1]} {g.by.split(' ')[2]}</p>
                      </div>
                   </div>
                </td>
                <td className="p-4 pr-6">
                  <div className="flex gap-2 justify-center items-center">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-green-50 text-green-600 border border-green-200 bg-white text-[11px] font-bold"><RotateCcw className="w-3 h-3"/> Restore</button>
                    <button className="p-1.5 rounded-md hover:bg-slate-50 text-slate-400 border border-slate-200 bg-white"><MoreVertical className="w-3.5 h-3.5"/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-white">
          <p className="text-xs text-slate-500">Showing 1 to 8 of 8 suspended garages</p>
          <div className="flex items-center gap-2">
             <select className="border rounded bg-white text-xs px-2 py-1 outline-none"><option>10 per page</option></select>
             <div className="flex border rounded overflow-hidden">
                <button className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-400 text-xs border-r">&lt;</button>
                <button className="px-3 py-1 bg-blue-600 text-white text-xs font-bold border-r">1</button>
                <button className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-600 text-xs">&gt;</button>
             </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
