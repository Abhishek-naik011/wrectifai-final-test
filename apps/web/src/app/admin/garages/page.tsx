'use client';
import { Card } from '@/components/common/card';
import { Search, Filter, Download, Plus, MoreVertical, Eye, Edit2, PauseCircle, CheckCircle2, Clock } from 'lucide-react';

export default function AllGaragesPage() {
  const garages = [
    { id: 1, name: 'Metro Auto Bay', email: 'metroautobay@gmail.com', phone: '9876543210', owner: 'Rahul Sharma', city: 'Hyderabad', services: ['Engine', 'AC', 'Brakes', '+2'], rating: 4.6, reviews: 128, status: 'Approved', joined: '30 Jul, 2024' },
    { id: 2, name: 'SpeedFix Auto Care', email: 'speedfix@gmail.com', phone: '9123456780', owner: 'Priya Reddy', city: 'Hyderabad', services: ['General', 'Tyres', 'Battery', '+1'], rating: 4.4, reviews: 94, status: 'Approved', joined: '30 Jul, 2024' },
    { id: 3, name: 'QuickPit Service Center', email: 'quickpit@gmail.com', phone: '9988776655', owner: 'Karthik Varma', city: 'Secunderabad', services: ['Engine', 'Suspension', 'AC', '+2'], rating: 4.7, reviews: 156, status: 'Pending', joined: '29 Jul, 2024' },
    { id: 4, name: 'DriveWell Garage', email: 'drivewell@gmail.com', phone: '9012345678', owner: 'Imran Khan', city: 'Hyderabad', services: ['General', 'Detailing', 'AC'], rating: 4.3, reviews: 72, status: 'Approved', joined: '29 Jul, 2024' },
    { id: 5, name: 'AutoWorks Garage', email: 'autoworks@gmail.com', phone: '9345678901', owner: 'Sneha Patel', city: 'Hyderabad', services: ['Tyres', 'Alignment', 'Balancing', '+1'], rating: 4.5, reviews: 88, status: 'Approved', joined: '28 Jul, 2024' },
    { id: 6, name: 'GearUp Garage', email: 'gearup@gmail.com', phone: '9900112233', owner: 'Vikram Singh', city: 'Hyderabad', services: ['Engine', 'AC', 'Brakes', '+1'], rating: 4.2, reviews: 65, status: 'Suspended', joined: '27 Jul, 2024' },
    { id: 7, name: 'Honest Auto Care', email: 'honestauto@gmail.com', phone: '9888997766', owner: 'Arjun Reddy', city: 'Warangal', services: ['General', 'AC', 'Battery'], rating: 4.1, reviews: 44, status: 'Approved', joined: '27 Jul, 2024' },
    { id: 8, name: 'Prime Garage', email: 'primegarage@gmail.com', phone: '9151515151', owner: 'Manoj Kumar', city: 'Hyderabad', services: ['Engine', 'Tyres', 'Brakes', '+2'], rating: 4.0, reviews: 31, status: 'Pending', joined: '26 Jul, 2024' },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold text-[#17307a] mb-1">All Garages</h1>
           <p className="text-sm text-slate-500">Dashboard &gt; Garage Management &gt; All Garages</p>
        </div>
        <a href="/admin/garages/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2"><Plus className="w-4 h-4"/> Register Garage</a>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-5 bg-white border border-blue-100 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><div className="text-2xl">🏪</div></div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-0.5">Total Garages</p>
            <p className="text-2xl font-black text-[#17307a]">146</p>
            <p className="text-[10px] font-bold text-green-500">↑ 8 this month</p>
          </div>
        </Card>
        <Card className="p-5 bg-white border border-green-100 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center"><CheckCircle2 className="w-6 h-6"/></div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-0.5">Approved Garages</p>
            <p className="text-2xl font-black text-[#17307a]">118</p>
            <p className="text-[10px] font-bold text-green-500">↑ 6 this month</p>
          </div>
        </Card>
        <Card className="p-5 bg-white border border-orange-100 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center"><Clock className="w-6 h-6"/></div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-0.5">Pending Approvals</p>
            <p className="text-2xl font-black text-[#17307a]">12</p>
            <p className="text-[10px] font-bold text-red-500">Action Required</p>
          </div>
        </Card>
        <Card className="p-5 bg-white border border-purple-100 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center"><PauseCircle className="w-6 h-6"/></div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-0.5">Suspended Garages</p>
            <p className="text-2xl font-black text-[#17307a]">8</p>
            <p className="text-[10px] font-bold text-red-500">↓ 2 this month</p>
          </div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
           <div className="relative w-80">
             <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
             <input type="text" placeholder="Search by garage name, owner, email or phone..." className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm bg-white outline-none focus:ring-1 focus:ring-blue-500" />
           </div>
           <div className="flex gap-3">
             <select className="border rounded-lg px-3 py-2 text-sm outline-none bg-white font-medium text-slate-600 min-w-[120px]"><option>All Status</option></select>
             <select className="border rounded-lg px-3 py-2 text-sm outline-none bg-white font-medium text-slate-600 min-w-[120px]"><option>All Cities</option></select>
             <select className="border rounded-lg px-3 py-2 text-sm outline-none bg-white font-medium text-slate-600 min-w-[120px]"><option>All Services</option></select>
             <button className="bg-white text-slate-600 border px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 hover:bg-slate-50"><Filter className="w-4 h-4"/> More Filters</button>
             <button className="bg-white text-slate-600 border px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 ml-4 hover:bg-slate-50"><Download className="w-4 h-4"/> Export</button>
           </div>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="p-4 w-10"><input type="checkbox" className="rounded border-slate-300"/></th>
              <th className="p-4 text-xs font-bold text-slate-500">Garage Name</th>
              <th className="p-4 text-xs font-bold text-slate-500">Owner</th>
              <th className="p-4 text-xs font-bold text-slate-500">City</th>
              <th className="p-4 text-xs font-bold text-slate-500">Services</th>
              <th className="p-4 text-xs font-bold text-slate-500">Rating</th>
              <th className="p-4 text-xs font-bold text-slate-500">Status</th>
              <th className="p-4 text-xs font-bold text-slate-500">Joined Date</th>
              <th className="p-4 text-xs font-bold text-slate-500 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {garages.map(g => (
              <tr key={g.id} className="hover:bg-slate-50 bg-white">
                <td className="p-4"><input type="checkbox" className="rounded border-slate-300"/></td>
                <td className="p-4">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full border border-slate-100 bg-white flex items-center justify-center p-1 overflow-hidden flex-shrink-0 text-[10px] text-center font-bold">{g.name.split(' ')[0]}</div>
                    <div>
                      <p className="text-sm font-bold text-[#17307a] leading-tight">{g.name}</p>
                      <p className="text-[10px] text-slate-500">{g.email}</p>
                      <p className="text-[10px] text-slate-500">{g.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-xs font-bold text-[#17307a] leading-tight">{g.owner}</p>
                  <p className="text-[10px] text-slate-500">{g.phone}</p>
                </td>
                <td className="p-4 text-xs text-slate-600">{g.city}</td>
                <td className="p-4">
                  <div className="flex gap-1 flex-wrap w-32">
                     {g.services.map((s, i) => (
                       <span key={i} className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${s.startsWith('+') ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>{s}</span>
                     ))}
                  </div>
                </td>
                <td className="p-4 text-xs">
                  <span className="font-bold text-orange-500">★ {g.rating}</span> <span className="text-slate-400">({g.reviews})</span>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${g.status === 'Approved' ? 'bg-green-50 text-green-600 border-green-100' : g.status === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>{g.status}</span>
                </td>
                <td className="p-4 text-xs text-slate-600">{g.joined}</td>
                <td className="p-4">
                  <div className="flex gap-1.5 justify-center">
                    <button className="p-1.5 rounded-md hover:bg-blue-50 text-blue-500 border border-slate-200 bg-white"><Eye className="w-3.5 h-3.5"/></button>
                    <button className="p-1.5 rounded-md hover:bg-slate-50 text-slate-600 border border-slate-200 bg-white"><Edit2 className="w-3.5 h-3.5"/></button>
                    <button className="p-1.5 rounded-md hover:bg-orange-50 text-orange-500 border border-slate-200 bg-white"><PauseCircle className="w-3.5 h-3.5"/></button>
                    <button className="p-1.5 rounded-md hover:bg-slate-50 text-slate-400 border border-slate-200 bg-white"><MoreVertical className="w-3.5 h-3.5"/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-white">
          <p className="text-xs text-slate-500">Showing 1 to 8 of 146 garages</p>
          <div className="flex items-center gap-2">
             <select className="border rounded bg-white text-xs px-2 py-1 outline-none"><option>10 per page</option></select>
             <div className="flex border rounded overflow-hidden">
                <button className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-400 text-xs border-r">&lt;</button>
                <button className="px-3 py-1 bg-blue-600 text-white text-xs font-bold border-r">1</button>
                <button className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-600 text-xs border-r">2</button>
                <button className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-600 text-xs border-r">3</button>
                <button className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-600 text-xs border-r">...</button>
                <button className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-600 text-xs border-r">15</button>
                <button className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-600 text-xs">&gt;</button>
             </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
