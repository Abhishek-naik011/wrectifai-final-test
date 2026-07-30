'use client';
import { Card } from '@/components/common/card';
import { Search, Filter, Download, MoreVertical, AlertTriangle, FileWarning, RotateCcw, XCircle, Clock, ShieldAlert, UserX, Flag } from 'lucide-react';

export default function SuspendedCustomersPage() {
  const suspendedCustomers = [
    { id: 1, initials: 'MK', name: 'Manoj Kumar', email: 'manoj.kumar@gmail.com', phone: '98765 43210', reason: 'Policy Violations', reasonDesc: 'Multiple policy violations reported', icon: AlertTriangle, iconColor: 'text-red-500', iconBg: 'bg-red-50', badges: '+2', suspendedOn: '30 Jul, 2024\n10:30 AM', suspendedBy: 'Admin\nSurabi N', bgColor: 'bg-pink-100 text-pink-600' },
    { id: 2, initials: 'RS', name: 'Rohit Sharma', email: 'rohit.sharma@gmail.com', phone: '91234 56780', reason: 'Fraudulent Activity', reasonDesc: 'Found suspicious transaction pattern', icon: ShieldAlert, iconColor: 'text-orange-500', iconBg: 'bg-orange-50', badges: null, suspendedOn: '29 Jul, 2024\n04:20 PM', suspendedBy: 'Admin\nSurabi N', bgColor: 'bg-green-100 text-green-600' },
    { id: 3, initials: 'VS', name: 'Vikram Singh', email: 'vikram.singh@gmail.com', phone: '90123 45678', reason: 'Invalid Information', reasonDesc: 'Submitted invalid documents', icon: FileWarning, iconColor: 'text-red-500', iconBg: 'bg-red-50', badges: null, suspendedOn: '28 Jul, 2024\n01:15 PM', suspendedBy: 'Admin\nSurabi N', bgColor: 'bg-yellow-100 text-yellow-600' },
    { id: 4, initials: 'SP', name: 'Sneha Patel', email: 'sneha.patel@gmail.com', phone: '93456 78901', reason: 'Abusive Behavior', reasonDesc: 'Inappropriate behavior towards garage', icon: UserX, iconColor: 'text-orange-500', iconBg: 'bg-orange-50', badges: null, suspendedOn: '27 Jul, 2024\n11:05 AM', suspendedBy: 'Admin\nSurabi N', bgColor: 'bg-purple-100 text-purple-600' },
    { id: 5, initials: 'AK', name: 'Arjun Kumar', email: 'arjun.kumar@gmail.com', phone: '90001 12233', reason: 'Payment Issues', reasonDesc: 'Failed to settle platform dues', icon: XCircle, iconColor: 'text-red-500', iconBg: 'bg-red-50', badges: null, suspendedOn: '25 Jul, 2024\n09:30 AM', suspendedBy: 'Admin\nSurabi N', bgColor: 'bg-blue-100 text-blue-600' },
    { id: 6, initials: 'NP', name: 'Neha Priya', email: 'neha.priya@gmail.com', phone: '88888 97654', reason: 'Account Misuse', reasonDesc: 'Misuse of account privileges', icon: UserX, iconColor: 'text-red-500', iconBg: 'bg-red-50', badges: null, suspendedOn: '24 Jul, 2024\n03:45 PM', suspendedBy: 'Admin\nSurabi N', bgColor: 'bg-purple-100 text-purple-600' },
    { id: 7, initials: 'DK', name: 'Deepak Kumar', email: 'deepak.kumar@gmail.com', phone: '77770 01122', reason: 'No Show / Cancellation', reasonDesc: 'Repeated no show and cancellations', icon: Clock, iconColor: 'text-orange-500', iconBg: 'bg-orange-50', badges: null, suspendedOn: '22 Jul, 2024\n02:20 PM', suspendedBy: 'Admin\nSurabi N', bgColor: 'bg-green-100 text-green-600' },
    { id: 8, initials: 'PJ', name: 'Pooja Jain', email: 'pooja.jain@gmail.com', phone: '93412 34567', reason: 'Other Violations', reasonDesc: 'Violation of platform guidelines', icon: Flag, iconColor: 'text-red-500', iconBg: 'bg-red-50', badges: null, suspendedOn: '20 Jul, 2024\n05:10 PM', suspendedBy: 'Admin\nSurabi N', bgColor: 'bg-red-100 text-red-600' },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
             <h1 className="text-2xl font-bold text-slate-900">Suspended Customers</h1>
             <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">86</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Dashboard &gt; Customer Management &gt; Suspended Customers</p>
        </div>
        <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-5 flex items-center gap-4 shadow-sm border-slate-200">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center"><UserX className="w-6 h-6"/></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Suspended</p>
            <h3 className="text-2xl font-bold text-slate-800">86</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Customers</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4 shadow-sm border-slate-200">
          <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center"><AlertTriangle className="w-6 h-6"/></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Suspended This Month</p>
            <h3 className="text-2xl font-bold text-slate-800">23</h3>
            <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">↓ 12 less than last month</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4 shadow-sm border-slate-200">
          <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center"><Clock className="w-6 h-6"/></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Avg. Suspension Duration</p>
            <h3 className="text-2xl font-bold text-slate-800">21</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Days</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4 shadow-sm border-slate-200">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><RotateCcw className="w-6 h-6"/></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Restored This Month</p>
            <h3 className="text-2xl font-bold text-slate-800">9</h3>
            <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">↑ 3 more than last month</p>
          </div>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-200">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="text" placeholder="Search by name, email or phone number..." className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>
          <div className="flex items-center gap-3">
            <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 focus:outline-none bg-white">
              <option>All Reasons</option>
            </select>
            <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 focus:outline-none bg-white">
              <option>All Cities</option>
            </select>
            <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 focus:outline-none bg-white">
              <option>All Status</option>
            </select>
            <button className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
              <Filter className="w-4 h-4" /> More Filters
            </button>
            <div className="border-l border-slate-200 pl-3">
               <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 font-medium">
                 Sort by<br/>Newest First <Filter className="w-4 h-4 ml-1" />
               </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-xs font-semibold text-slate-500 border-b border-slate-100">
                <th className="p-4 font-semibold w-10"></th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Contact</th>
                <th className="p-4 font-semibold">Reason for Suspension</th>
                <th className="p-4 font-semibold">Suspended On</th>
                <th className="p-4 font-semibold">Suspended By</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {suspendedCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                     <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${c.bgColor}`}>
                        {c.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                        <p className="text-xs text-slate-500">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-slate-700 flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">📞</div> {c.phone}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-1"><div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">✉️</div> {c.email}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-start gap-2">
                       <c.icon className={`w-4 h-4 mt-0.5 ${c.iconColor}`} />
                       <div>
                          <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            {c.reason} 
                            {c.badges && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">{c.badges}</span>}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">{c.reasonDesc}</p>
                       </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-700 whitespace-pre-line flex items-center gap-2">
                     <Clock className="w-4 h-4 text-slate-400" />
                     {c.suspendedOn}
                  </td>
                  <td className="p-4">
                     <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-blue-600"/>
                        <p className="text-sm text-slate-700 whitespace-pre-line">{c.suspendedBy}</p>
                     </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700">
                      Suspended
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-green-100"><RotateCcw className="w-3.5 h-3.5" /> Restore</button>
                      <button className="w-8 h-8 rounded flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">Showing 1 to 8 of 86 suspended customers</p>
          <div className="flex items-center gap-2">
            <select className="px-2 py-1 text-sm border border-slate-200 rounded text-slate-600 focus:outline-none bg-white">
              <option>10 per page</option>
            </select>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded flex items-center justify-center text-slate-400 hover:bg-slate-50">&lt;</button>
              <button className="w-8 h-8 rounded flex items-center justify-center bg-blue-600 text-white font-medium">1</button>
              <button className="w-8 h-8 rounded flex items-center justify-center text-slate-600 hover:bg-slate-50">2</button>
              <button className="w-8 h-8 rounded flex items-center justify-center text-slate-600 hover:bg-slate-50">3</button>
              <span className="text-slate-400">...</span>
              <button className="w-8 h-8 rounded flex items-center justify-center text-slate-600 hover:bg-slate-50">9</button>
              <button className="w-8 h-8 rounded flex items-center justify-center text-slate-600 hover:bg-slate-50">&gt;</button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
