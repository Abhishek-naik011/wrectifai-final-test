'use client';
import { Card } from '@/components/common/card';
import { Search, Filter, MoreVertical, FileText, AlertCircle, User, UserX, Eye, Calendar, Clock, CheckCircle2, X } from 'lucide-react';

export default function PendingRequestsPage() {
  const requests = [
    { id: 'REQ-1298', sr: '#SR1298', title: 'Brake Noise', desc: 'Hearing a squeaking noise\nwhen applying brakes.', customer: { initials: 'RS', name: 'Rahul Sharma', phone: '98765 43210', email: 'rahul.sharma@gmail.com' }, garage: { name: 'SpeedFix Auto Care', distance: '5.2 km away', location: 'Hyderabad, TS' }, vehicle: { reg: 'TS09 AB 1234', model: 'Hyundai i20 (2020)', fuel: 'Petrol', km: '38,450 km' }, ai: { service: 'Brake Inspection', diagnosis: 'Possible brake pad wear\ndetected.', risk: 'Medium Risk' }, priority: 'Medium', sla: '02:45:30', slaText: 'SLA: 4 hrs', date: '30 Jul, 2024', time: '10:30 AM' },
    { id: 'REQ-1297', sr: '#SR1297', title: 'AC Not Cooling', desc: 'AC is not cooling properly\neven at low temperature.', customer: { initials: 'PS', name: 'Priya Singh', phone: '91234 56780', email: 'priya.singh@gmail.com' }, garage: { name: 'QuickPit Service Center', distance: '3.8 km away', location: 'Secunderabad, TS' }, vehicle: { reg: 'TS09 CD 5678', model: 'Maruti Swift (2019)', fuel: 'Petrol', km: '62,100 km' }, ai: { service: 'AC System Check', diagnosis: 'Low refrigerant level\nsuspected.', risk: 'High Risk' }, priority: 'High', sla: '01:15:20', slaText: 'SLA: 3 hrs', date: '30 Jul, 2024', time: '09:15 AM' },
    { id: 'REQ-1296', sr: '#SR1296', title: 'Engine Oil Leakage', desc: 'Noticing oil leakage from\nthe engine area.', customer: { initials: 'AK', name: 'Arjun Kumar', phone: '90123 45678', email: 'arjun.kumar@gmail.com' }, garage: { name: 'DriveWell Garage', distance: '6.1 km away', location: 'Hyderabad, TS' }, vehicle: { reg: 'TS09 EF 9012', model: 'Honda City (2021)', fuel: 'Petrol', km: '24,780 km' }, ai: { service: 'Engine Checkup', diagnosis: 'Possible valve cover\ngasket leak.', risk: 'Medium Risk' }, priority: 'Medium', sla: '02:10:45', slaText: 'SLA: 4 hrs', date: '29 Jul, 2024', time: '04:20 PM' },
    { id: 'REQ-1295', sr: '#SR1295', title: 'Battery Draining', desc: 'Battery gets drained\novernight.', customer: { initials: 'SN', name: 'Sneha Nair', phone: '93456 78901', email: 'sneha.nair@gmail.com' }, garage: { name: 'AutoWorks Garage', distance: '4.3 km away', location: 'Kukatpally, TS' }, vehicle: { reg: 'TS09 GH 3456', model: 'Tata Nexon (2020)', fuel: 'Diesel', km: '45,200 km' }, ai: { service: 'Battery Check', diagnosis: 'Battery health may be\npoor.', risk: 'Low Risk' }, priority: 'Low', sla: '03:30:10', slaText: 'SLA: 6 hrs', date: '29 Jul, 2024', time: '02:45 PM' },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pending Requests</h1>
          <p className="text-sm text-slate-500">Dashboard &gt; Service Requests &gt; Pending Requests</p>
        </div>
        <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
          <FileText className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-5 flex items-center gap-4 shadow-sm border-slate-200">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><FileText className="w-6 h-6"/></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Pending Today</p>
            <h3 className="text-2xl font-bold text-slate-800">124</h3>
            <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">↓ 8 vs yesterday</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4 shadow-sm border-slate-200">
          <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center"><AlertCircle className="w-6 h-6"/></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">High Priority</p>
            <h3 className="text-2xl font-bold text-slate-800">36</h3>
            <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">↓ 5 vs yesterday</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4 shadow-sm border-slate-200">
          <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center"><User className="w-6 h-6"/></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Assigned</p>
            <h3 className="text-2xl font-bold text-slate-800">68</h3>
            <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">↑ 12 vs yesterday</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4 shadow-sm border-slate-200">
          <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><UserX className="w-6 h-6"/></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Unassigned</p>
            <h3 className="text-2xl font-bold text-slate-800">56</h3>
            <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">↓ 6 vs yesterday</p>
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
                 Sort by<br/>Requested On (Newest) <Filter className="w-4 h-4 ml-1" />
               </button>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-b border-slate-100">
          <p className="text-sm font-bold text-blue-600">Total Pending Requests: 124</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[11px] font-semibold text-slate-500 border-b border-slate-100 uppercase">
                <th className="p-4">Request Details</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Garage & Location</th>
                <th className="p-4">Vehicle</th>
                <th className="p-4">Service & AI Diagnosis</th>
                <th className="p-4">Priority</th>
                <th className="p-4">SLA / Time Left</th>
                <th className="p-4">Requested On</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 min-w-[200px]">
                    <div className="flex gap-4">
                       <div className="w-24">
                          <p className="text-sm font-bold text-blue-600">{r.id}</p>
                          <p className="text-[10px] text-slate-400 mb-1">{r.sr}</p>
                          <span className="px-1.5 py-0.5 rounded bg-orange-50 text-orange-600 text-[9px] font-semibold border border-orange-100">New Request</span>
                       </div>
                       <div>
                          <p className="text-[13px] font-bold text-slate-900">{r.title}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 whitespace-pre-line">{r.desc}</p>
                          <button className="text-[10px] text-blue-600 font-medium mt-1 flex items-center gap-0.5">View More <span>⌄</span></button>
                       </div>
                    </div>
                  </td>
                  <td className="p-4 min-w-[180px]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">{r.customer.initials}</div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{r.customer.name}</p>
                        <p className="text-[11px] text-slate-500">{r.customer.phone}</p>
                        <p className="text-[10px] text-slate-400">{r.customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 min-w-[180px]">
                    <div className="flex items-start gap-2">
                      <span className="text-slate-400 mt-0.5 text-sm">🏪</span>
                      <div>
                        <p className="text-[13px] font-bold text-slate-900">{r.garage.name}</p>
                        <p className="text-[11px] text-green-600 flex items-center gap-1"><span className="text-[10px]">📍</span> {r.garage.distance}</p>
                        <p className="text-[10px] text-slate-400">{r.garage.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 min-w-[140px]">
                    <div className="flex items-start gap-2">
                      <span className="text-slate-400 mt-0.5 text-sm">🚗</span>
                      <div>
                        <p className="text-[13px] font-bold text-slate-900">{r.vehicle.reg}</p>
                        <p className="text-[11px] text-slate-500">{r.vehicle.model}</p>
                        <p className="text-[10px] text-slate-400">{r.vehicle.fuel} • {r.vehicle.km}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 min-w-[200px]">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 inline-block mb-1">{r.ai.service}</span>
                    <p className="text-[11px] font-bold text-blue-600">AI Diagnosis</p>
                    <p className="text-[11px] text-slate-600 whitespace-pre-line mt-0.5">{r.ai.diagnosis}</p>
                    <span className={`mt-1 inline-block px-1.5 py-0.5 rounded text-[9px] font-semibold ${r.ai.risk.includes('High') ? 'bg-red-50 text-red-600 border border-red-100' : r.ai.risk.includes('Medium') ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>{r.ai.risk}</span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-bold ${r.priority === 'High' ? 'text-red-500' : r.priority === 'Medium' ? 'text-orange-500' : 'text-green-500'}`}>{r.priority}</span>
                  </td>
                  <td className="p-4 min-w-[120px]">
                    <div className="flex flex-col items-center justify-center">
                       <div className="flex items-center gap-1.5 mb-1 text-orange-600 font-bold">
                          <Clock className="w-4 h-4" />
                          <span>{r.sla}</span>
                       </div>
                       <span className="text-[10px] text-slate-500">Remaining</span>
                       <span className="text-[9px] text-slate-400 border-t border-slate-200 border-dashed pt-1 mt-1 w-full text-center">{r.slaText}</span>
                    </div>
                  </td>
                  <td className="p-4 min-w-[120px]">
                    <div className="flex items-start gap-1.5">
                       <Calendar className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                       <div>
                          <p className="text-[11px] text-slate-700">{r.date}</p>
                          <p className="text-[10px] text-slate-500">{r.time}</p>
                       </div>
                    </div>
                  </td>
                  <td className="p-4 min-w-[180px]">
                    <div className="flex gap-2">
                       <div className="flex flex-col gap-1.5 flex-1">
                          <button className="w-full flex items-center justify-center gap-1.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 border border-blue-200 rounded transition-colors"><Eye className="w-3 h-3" /> View</button>
                          <button className="w-full flex items-center justify-center gap-1.5 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"><User className="w-3 h-3" /> Assign Garage</button>
                          <div className="flex gap-1.5">
                             <button className="flex-1 flex items-center justify-center gap-1 py-1 text-[10px] font-medium text-green-600 hover:bg-green-50 border border-green-200 rounded transition-colors"><CheckCircle2 className="w-2.5 h-2.5" /> Approve</button>
                             <button className="flex-1 flex items-center justify-center gap-1 py-1 text-[10px] font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded transition-colors"><X className="w-2.5 h-2.5" /> Reject</button>
                          </div>
                          <button className="w-full flex items-center justify-center gap-1.5 py-1 text-[10px] font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 rounded transition-colors"><AlertCircle className="w-2.5 h-2.5" /> Escalate</button>
                       </div>
                       <button className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors shrink-0"><MoreVertical className="w-3 h-3" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">Showing 1 to 10 of 124 pending requests</p>
          <div className="flex items-center gap-2">
            <select className="px-2 py-1 text-sm border border-slate-200 rounded text-slate-600 bg-white">
              <option>10 per page</option>
            </select>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded flex items-center justify-center text-slate-400 hover:bg-slate-50">&lt;</button>
              <button className="w-8 h-8 rounded flex items-center justify-center bg-blue-600 text-white font-medium">1</button>
              <button className="w-8 h-8 rounded flex items-center justify-center text-slate-600 hover:bg-slate-50">2</button>
              <button className="w-8 h-8 rounded flex items-center justify-center text-slate-600 hover:bg-slate-50">3</button>
              <span className="text-slate-400">...</span>
              <button className="w-8 h-8 rounded flex items-center justify-center text-slate-600 hover:bg-slate-50">13</button>
              <button className="w-8 h-8 rounded flex items-center justify-center text-slate-600 hover:bg-slate-50">&gt;</button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
