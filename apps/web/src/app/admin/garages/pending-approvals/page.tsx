'use client';
import { Card } from '@/components/common/card';
import { Search, Filter, Check, X as XIcon, CheckCircle2, Clock, FileText } from 'lucide-react';

export default function PendingApprovalsPage() {
  const pendingGarages = [
    { id: 1, name: 'Metro Auto Bay', email: 'metroautobay@gmail.com', phone: '98765 43210', owner: 'Rahul Sharma', city: 'Hyderabad, Telangana', services: ['Engine', 'AC', 'Brakes', '+1'], docs: { gst: 'Verified', license: 'Verified', id: 'Pending', photos: 'Verified' }, submitted: '30 Jul, 2024, 10:30 AM', isNew: true },
    { id: 2, name: 'SpeedFix Auto Care', email: 'speedfix@gmail.com', phone: '91234 56780', owner: 'Priya Reddy', city: 'Hyderabad, Telangana', services: ['General', 'Tyres', 'Battery'], docs: { gst: 'Verified', license: 'Pending', id: 'Verified', photos: 'Pending' }, submitted: '30 Jul, 2024, 09:15 AM', isNew: true },
    { id: 3, name: 'QuickPit Service Center', email: 'quickpit@gmail.com', phone: '99887 76655', owner: 'Karthik Varma', city: 'Secunderabad, Telangana', services: ['Engine', 'Suspension', 'AC', '+1'], docs: { gst: 'Verified', license: 'Verified', id: 'Pending', photos: 'Pending' }, submitted: '29 Jul, 2024, 06:45 PM', isNew: false },
    { id: 4, name: 'DriveWell Garage', email: 'drivewell@gmail.com', phone: '90123 45678', owner: 'Imran Khan', city: 'Hyderabad, Telangana', services: ['General', 'Detailing', 'AC'], docs: { gst: 'Pending', license: 'Pending', id: 'Verified', photos: 'Verified' }, submitted: '29 Jul, 2024, 04:20 PM', isNew: true },
    { id: 5, name: 'AutoWorks Garage', email: 'autoworks@gmail.com', phone: '93456 78901', owner: 'Sneha Patel', city: 'Hyderabad, Telangana', services: [], docs: { gst: 'Pending', license: 'Pending', id: 'Pending', photos: 'Pending' }, submitted: '28 Jul, 2024', isNew: false },
  ];

  const renderDocStatus = (label: string, status: string) => (
    <div className="flex items-center gap-2 mb-1.5 w-32">
       {status === 'Verified' ? <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0"/> : <Clock className="w-3 h-3 text-orange-500 flex-shrink-0"/>}
       <span className="text-[10px] text-slate-600 flex-1">{label}</span>
       <span className={`text-[9px] font-bold ${status === 'Verified' ? 'text-green-500' : 'text-orange-500'}`}>{status}</span>
    </div>
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold text-[#17307a] mb-1">Pending Garage Approvals <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-xs ml-2">12</span></h1>
           <p className="text-sm text-slate-500">Dashboard &gt; Garage Management &gt; Pending Approvals</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-5 bg-white border border-blue-100 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center"><div className="text-2xl">📋</div></div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-0.5">Total Pending</p>
            <p className="text-2xl font-black text-[#17307a]">12</p>
            <p className="text-[10px] font-bold text-blue-500">Awaiting Review</p>
          </div>
        </Card>
        <Card className="p-5 bg-white border border-orange-100 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center"><FileText className="w-6 h-6"/></div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-0.5">Documents Pending</p>
            <p className="text-2xl font-black text-[#17307a]">7</p>
            <p className="text-[10px] font-bold text-orange-500">Need Verification</p>
          </div>
        </Card>
        <Card className="p-5 bg-white border border-yellow-100 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center"><Clock className="w-6 h-6"/></div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-0.5">Submitted Today</p>
            <p className="text-2xl font-black text-[#17307a]">4</p>
            <p className="text-[10px] font-bold text-blue-500">New Submissions</p>
          </div>
        </Card>
        <Card className="p-5 bg-white border border-green-100 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center"><CheckCircle2 className="w-6 h-6"/></div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-0.5">Approved Today</p>
            <p className="text-2xl font-black text-[#17307a]">2</p>
            <p className="text-[10px] font-bold text-green-500">Ready to Go</p>
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
             <select className="border rounded-lg px-3 py-2 text-sm outline-none bg-white font-medium text-slate-600 min-w-[120px]"><option>All Status</option></select>
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
              <th className="p-4 text-xs font-bold text-slate-500 pl-8">Garage Details</th>
              <th className="p-4 text-xs font-bold text-slate-500">Owner Details</th>
              <th className="p-4 text-xs font-bold text-slate-500">Location & Services</th>
              <th className="p-4 text-xs font-bold text-slate-500">Documents Status</th>
              <th className="p-4 text-xs font-bold text-slate-500">Submitted On</th>
              <th className="p-4 text-xs font-bold text-slate-500 text-center pr-8">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pendingGarages.map(g => (
              <tr key={g.id} className="hover:bg-slate-50 bg-white relative">
                <td className="p-4 pl-8">
                  {g.isNew && <div className="absolute left-0 top-0 bg-orange-100 text-orange-600 text-[8px] font-bold px-1.5 py-0.5 rounded-br-lg">NEW</div>}
                  <div className="flex gap-3 items-center">
                    <div className="w-12 h-12 rounded-full border border-slate-100 bg-white flex items-center justify-center p-1 overflow-hidden flex-shrink-0 text-xs text-center font-bold">{g.name.split(' ')[0]}</div>
                    <div>
                      <p className="text-sm font-bold text-[#17307a] leading-tight mb-1">{g.name}</p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1">✉ {g.email}</p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1">📞 {g.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-xs font-bold text-slate-700 leading-tight mb-1 flex items-center gap-1">👤 {g.owner}</p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1">✉ {g.email.split('@')[0]}@gmail.com</p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1">📞 {g.phone}</p>
                </td>
                <td className="p-4">
                  <p className="text-[11px] font-bold text-slate-700 leading-tight mb-2 flex items-center gap-1">📍 {g.city}</p>
                  <p className="text-[9px] text-slate-400 font-bold mb-1">Services ({g.services.length})</p>
                  <div className="flex gap-1 flex-wrap w-40">
                     {g.services.map((s, i) => (
                       <span key={i} className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${s.startsWith('+') ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>{s}</span>
                     ))}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-6">
                     <div>
                       {renderDocStatus('GST Certificate', g.docs.gst)}
                       {renderDocStatus('Business License', g.docs.license)}
                     </div>
                     <div>
                       {renderDocStatus('Owner ID Proof', g.docs.id)}
                       {renderDocStatus('Shop Photos', g.docs.photos)}
                     </div>
                  </div>
                </td>
                <td className="p-4 text-xs text-slate-600">
                  <p className="text-[11px] font-bold text-slate-700 mb-0.5 flex items-center gap-1">📅 {g.submitted.split(',')[0]}</p>
                  {g.submitted.split(',')[1] && <p className="text-[10px] text-slate-500 flex items-center gap-1">🕒 {g.submitted.split(',')[1].trim()}</p>}
                </td>
                <td className="p-4 pr-8">
                  <div className="flex flex-col gap-1.5 items-end">
                    <button className="w-32 border border-blue-200 text-blue-600 bg-white rounded-md text-[11px] font-bold py-1.5 flex justify-center items-center gap-1.5 hover:bg-blue-50">↗ View Details</button>
                    <button className="w-32 border border-green-200 text-green-600 bg-white rounded-md text-[11px] font-bold py-1.5 flex justify-center items-center gap-1.5 hover:bg-green-50"><Check className="w-3 h-3"/> Approve</button>
                    <button className="w-32 border border-red-200 text-red-600 bg-white rounded-md text-[11px] font-bold py-1.5 flex justify-center items-center gap-1.5 hover:bg-red-50"><XIcon className="w-3 h-3"/> Reject</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-white">
          <p className="text-xs text-slate-500">Showing 1 to 5 of 12 pending garages</p>
          <div className="flex items-center gap-2">
             <select className="border rounded bg-white text-xs px-2 py-1 outline-none"><option>10 per page</option></select>
             <div className="flex border rounded overflow-hidden">
                <button className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-400 text-xs border-r">&lt;</button>
                <button className="px-3 py-1 bg-blue-600 text-white text-xs font-bold border-r">1</button>
                <button className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-600 text-xs border-r">2</button>
                <button className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-600 text-xs">&gt;</button>
             </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
