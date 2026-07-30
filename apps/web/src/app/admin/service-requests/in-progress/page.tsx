'use client';
import { Card } from '@/components/common/card';
import { Search, Filter, MoreVertical, Calendar, Clock, Download, Wrench, Eye } from 'lucide-react';

export default function InProgressRequestsPage() {
  const requests = [
    { id: 'REQ-1203', sr: '#SR1203', title: 'Engine making\nstrange knocking sound', customer: { initials: 'RS', name: 'Rahul Sharma', phone: '98765 43210', email: 'rahul.sharma@gmail.com' }, garage: { name: 'SpeedFix Auto Care', location: 'Hyderabad, TS', rating: '4.6 (128 reviews)' }, ai: { service: 'Engine Diagnostics', diagnosis: 'AI Diagnosis: Possible\npiston wear detected\nin cylinder 2.' }, status: { label: 'Work In Progress', progress: 65, color: 'bg-blue-600', note: 'Parts ordered\nParts will arrive by\n31 Jul, 2024' }, priority: 'Medium', expected: '1 Aug, 2024\n06:00 PM', updated: '30 Jul, 2024\n11:30 AM\nby Garage' },
    { id: 'REQ-1198', sr: '#SR1198', title: 'AC not cooling\nproperly', customer: { initials: 'PS', name: 'Priya Singh', phone: '91234 56780', email: 'priya.singh@gmail.com' }, garage: { name: 'QuickPit Service Center', location: 'Secunderabad, TS', rating: '4.4 (96 reviews)' }, ai: { service: 'AC System Check', diagnosis: 'AI Diagnosis: Low\nrefrigerant level\nsuspected.' }, status: { label: 'Service In Progress', progress: 40, color: 'bg-green-500', note: 'Technician assigned\n👨‍🔧 Ramesh Kumar' }, priority: 'High', expected: '31 Jul, 2024\n04:00 PM', updated: '30 Jul, 2024\n10:15 AM\nby Garage' },
    { id: 'REQ-1191', sr: '#SR1191', title: 'Brake squeaking\neven after service', customer: { initials: 'AK', name: 'Arjun Kumar', phone: '90123 45678', email: 'arjun.kumar@gmail.com' }, garage: { name: 'DriveWell Garage', location: 'Hyderabad, TS', rating: '4.5 (73 reviews)' }, ai: { service: 'Brake Inspection', diagnosis: 'AI Diagnosis: Brake\npads worn out.' }, status: { label: 'Parts Replacement', progress: 55, color: 'bg-purple-500', note: 'Parts in replacement\nFront brake pads' }, priority: 'Medium', expected: '1 Aug, 2024\n05:30 PM', updated: '30 Jul, 2024\n09:45 AM\nby Garage' },
    { id: 'REQ-1186', sr: '#SR1186', title: 'Battery draining\novernight', customer: { initials: 'SN', name: 'Sneha Nair', phone: '93456 78901', email: 'sneha.nair@gmail.com' }, garage: { name: 'AutoWorks Garage', location: 'Kukatpally, TS', rating: '4.3 (58 reviews)' }, ai: { service: 'Battery Check', diagnosis: 'AI Diagnosis: Possible\nparasitic drain in\nelectrical system.' }, status: { label: 'Diagnostics Completed', progress: 80, color: 'bg-green-600', note: 'Waiting for approval 🕒\nCustomer approval\npending' }, priority: 'Low', expected: '31 Jul, 2024\n03:00 PM', updated: '29 Jul, 2024\n06:20 PM\nby Garage' },
    { id: 'REQ-1179', sr: '#SR1179', title: 'Suspension making\nnoise on bumps', customer: { initials: 'RK', name: 'Rohit Kapoor', phone: '77770 01122', email: 'rohit.kapoor@gmail.com' }, garage: { name: 'GearUp Garage', location: 'Dilsukhnagar, TS', rating: '4.2 (64 reviews)' }, ai: { service: 'Suspension Check', diagnosis: 'AI Diagnosis: Worn out\nbushes in front\nsuspension.' }, status: { label: 'Work In Progress', progress: 30, color: 'bg-blue-600', note: 'Work in initial stage\nInspection completed' }, priority: 'Medium', expected: '1 Aug, 2024\n07:30 PM', updated: '29 Jul, 2024\n05:10 PM\nby Garage' },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">In Progress</h1>
          <p className="text-sm text-slate-500">Dashboard &gt; Service Requests &gt; In Progress</p>
        </div>
        <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-5 flex items-center gap-4 shadow-sm border-slate-200">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Wrench className="w-6 h-6"/></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">In Progress</p>
            <h3 className="text-2xl font-bold text-slate-800">426</h3>
            <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">↑ 12% vs last month</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4 shadow-sm border-slate-200">
          <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center"><Calendar className="w-6 h-6"/></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Avg. Completion Time</p>
            <h3 className="text-2xl font-bold text-slate-800">2.4 Days</h3>
            <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">↓ 8% vs last month</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4 shadow-sm border-slate-200">
          <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center"><Clock className="w-6 h-6"/></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Not Started Yet</p>
            <h3 className="text-2xl font-bold text-slate-800">78</h3>
            <p className="text-xs text-orange-600 font-medium mt-1">Awaiting garage action</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4 shadow-sm border-slate-200">
          <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><Clock className="w-6 h-6"/></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Due in Next 24 Hrs</p>
            <h3 className="text-2xl font-bold text-slate-800">31</h3>
            <p className="text-xs text-red-600 font-medium mt-1">Requires attention</p>
          </div>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-200">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="text" placeholder="Search by request ID, customer, vehicle or service..." className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex items-center gap-3">
            <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 bg-white">
              <option>All Services</option>
            </select>
            <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 bg-white">
              <option>All Garages</option>
            </select>
            <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 bg-white">
              <option>All Priorities</option>
            </select>
            <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 bg-white">
              <option>All Cities</option>
            </select>
            <button className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 bg-white hover:bg-slate-50">
              <Filter className="w-4 h-4" /> More Filters
            </button>
            <div className="border-l border-slate-200 pl-3">
               <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 font-medium">
                 Sort by<br/>Last Updated (Newest) <Filter className="w-4 h-4 ml-1" />
               </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[11px] font-semibold text-slate-500 border-b border-slate-100 uppercase">
                <th className="p-4">Request Details</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Garage</th>
                <th className="p-4">Service & Diagnosis</th>
                <th className="p-4">Status & Progress</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Expected Completion</th>
                <th className="p-4">Last Updated</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 min-w-[160px]">
                    <p className="text-[13px] font-bold text-slate-900">{r.id}</p>
                    <p className="text-[10px] text-slate-400 mb-1">{r.sr}</p>
                    <p className="text-[11px] text-slate-600 whitespace-pre-line mt-1">{r.title}</p>
                    <button className="text-[10px] text-blue-600 font-medium mt-1 flex items-center gap-0.5">View More <span>⌄</span></button>
                  </td>
                  <td className="p-4 min-w-[150px]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">{r.customer.initials}</div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{r.customer.name}</p>
                        <p className="text-[11px] text-slate-500">{r.customer.phone}</p>
                        <p className="text-[10px] text-slate-400">{r.customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 min-w-[150px]">
                    <div className="flex items-start gap-2">
                      <span className="text-slate-400 mt-0.5 text-sm">🏪</span>
                      <div>
                        <p className="text-[13px] font-bold text-slate-900">{r.garage.name}</p>
                        <p className="text-[11px] text-slate-500"><span className="text-[10px]">📍</span> {r.garage.location}</p>
                        <p className="text-[10px] text-green-600 mt-0.5 flex items-center gap-0.5">⭐ {r.garage.rating}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 min-w-[180px]">
                    <p className="text-[12px] font-bold text-slate-900">{r.ai.service}</p>
                    <p className="text-[11px] text-slate-600 whitespace-pre-line mt-1">{r.ai.diagnosis}</p>
                    <button className="text-[10px] text-blue-600 font-medium mt-1">View Report</button>
                  </td>
                  <td className="p-4 min-w-[180px]">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[11px] font-bold ${r.status.color.replace('bg-', 'text-')}`}>{r.status.label}</span>
                      <span className="text-[10px] font-bold text-slate-700">{r.status.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2">
                      <div className={`${r.status.color} h-1.5 rounded-full`} style={{ width: `${r.status.progress}%` }}></div>
                    </div>
                    <p className="text-[10px] text-slate-500 whitespace-pre-line">{r.status.note}</p>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-bold ${r.priority === 'High' ? 'text-red-500' : r.priority === 'Medium' ? 'text-orange-500' : 'text-green-500'}`}>{r.priority}</span>
                  </td>
                  <td className="p-4 min-w-[120px]">
                    <div className="flex items-start gap-1.5">
                       <Calendar className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                       <p className="text-[11px] text-slate-700 whitespace-pre-line">{r.expected}</p>
                    </div>
                  </td>
                  <td className="p-4 min-w-[120px]">
                    <div className="flex items-start gap-1.5">
                       <Clock className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                       <p className="text-[10px] text-slate-500 whitespace-pre-line">{r.updated}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 justify-center">
                       <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors whitespace-nowrap"><Eye className="w-3.5 h-3.5" /> View Details</button>
                       <button className="w-8 h-8 rounded flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">Showing 1 to 10 of 426 in progress requests</p>
          <div className="flex items-center gap-2">
            <select className="px-2 py-1 text-sm border border-slate-200 rounded text-slate-600 bg-white">
              <option>10 per page</option>
            </select>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded flex items-center justify-center text-slate-400 hover:bg-slate-50">&lt;</button>
              <button className="w-8 h-8 rounded flex items-center justify-center bg-blue-600 text-white font-medium">1</button>
              <button className="w-8 h-8 rounded flex items-center justify-center text-slate-600 hover:bg-slate-50">2</button>
              <button className="w-8 h-8 rounded flex items-center justify-center text-slate-600 hover:bg-slate-50">3</button>
              <button className="w-8 h-8 rounded flex items-center justify-center text-slate-600 hover:bg-slate-50">4</button>
              <button className="w-8 h-8 rounded flex items-center justify-center text-slate-600 hover:bg-slate-50">5</button>
              <span className="text-slate-400">...</span>
              <button className="w-8 h-8 rounded flex items-center justify-center text-slate-600 hover:bg-slate-50">43</button>
              <button className="w-8 h-8 rounded flex items-center justify-center text-slate-600 hover:bg-slate-50">&gt;</button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
