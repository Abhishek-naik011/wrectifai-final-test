const fs = require('fs');
const path = require('path');

const write = (filepath, content) => {
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filepath, content.trim() + '\n', 'utf8');
};

const adminAuditDir = 'd:/WRECTIFIAI/wrectifai/apps/web/src/app/admin/audit';

write(`${adminAuditDir}/page.tsx`, `
'use client';
import { Card } from '@/components/common/card';
import { Search, Filter, Calendar, MoreVertical, FileText, CheckCircle2, AlertTriangle, Users, FileSpreadsheet, ShieldCheck, Clock } from 'lucide-react';

export default function AuditLogsPage() {
  const logs = [
    { id: '1', date: '29 Jun, 2024\\n11:59 PM', admin: { initials: 'AS', name: 'Admin Surabi N', email: 'admin@wrectifai.com', color: 'bg-blue-100 text-blue-600' }, action: 'CREATE', actionColor: 'text-green-600', module: 'Garage Management', target: 'Metro Auto Bay\\n(Garage ID: G-1023)', details: 'New garage registered\\nand pending approval', ip: '103.21.244.12', status: 'Success', statusColor: 'bg-green-50 text-green-600' },
    { id: '2', date: '29 Jun, 2024\\n11:45 PM', admin: { initials: 'AS', name: 'Admin Surabi N', email: 'admin@wrectifai.com', color: 'bg-blue-100 text-blue-600' }, action: 'UPDATE', actionColor: 'text-blue-600', module: 'Customer Management', target: 'Rahul Sharma\\n(Customer ID: C-2501)', details: 'Customer status updated\\nto Verified', ip: '103.21.244.12', status: 'Success', statusColor: 'bg-green-50 text-green-600' },
    { id: '3', date: '29 Jun, 2024\\n11:30 PM', admin: { initials: 'MR', name: 'Manoj Kumar', email: 'manoj@wrectifai.com', color: 'bg-orange-100 text-orange-600' }, action: 'APPROVE', actionColor: 'text-orange-500', module: 'Garage Management', target: 'SpeedFix Auto Care\\n(Garage ID: G-1018)', details: 'Garage approved and\\nactivated', ip: '106.51.32.87', status: 'Success', statusColor: 'bg-green-50 text-green-600' },
    { id: '4', date: '29 Jun, 2024\\n10:50 PM', admin: { initials: 'AS', name: 'Admin Surabi N', email: 'admin@wrectifai.com', color: 'bg-blue-100 text-blue-600' }, action: 'DELETE', actionColor: 'text-red-600', module: 'Service Requests', target: 'REQ-1092\\n(Request ID)', details: 'Service request cancelled\\nby admin', ip: '103.21.244.12', status: 'Success', statusColor: 'bg-green-50 text-green-600' },
    { id: '5', date: '29 Jun, 2024\\n10:20 PM', admin: { initials: 'RK', name: 'Ramesh Kumar', email: 'ramesh@wrectifai.com', color: 'bg-emerald-100 text-emerald-600' }, action: 'UPDATE', actionColor: 'text-blue-600', module: 'Bookings', target: 'BK-1287\\n(Booking ID)', details: 'Booking rescheduled to\\n02 Jul, 2024', ip: '117.199.89.45', status: 'Success', statusColor: 'bg-green-50 text-green-600' },
    { id: '6', date: '29 Jun, 2024\\n09:35 PM', admin: { initials: 'AS', name: 'Admin Surabi N', email: 'admin@wrectifai.com', color: 'bg-blue-100 text-blue-600' }, action: 'REJECT', actionColor: 'text-orange-500', module: 'Customer Management', target: 'Neha Priya\\n(Customer ID: C-2490)', details: 'KYC documents rejected\\n(Address proof invalid)', ip: '103.21.244.12', status: 'Failed', statusColor: 'bg-red-50 text-red-600' },
    { id: '7', date: '29 Jun, 2024\\n09:10 PM', admin: { initials: 'DP', name: 'Deepak Singh', email: 'deepak@wrectifai.com', color: 'bg-red-100 text-red-600' }, action: 'CREATE', actionColor: 'text-green-600', module: 'Quotes', target: 'QT-1145\\n(Quote ID)', details: 'New quote created for\\ncustomer', ip: '49.37.28.19', status: 'Success', statusColor: 'bg-green-50 text-green-600' },
    { id: '8', date: '29 Jun, 2024\\n08:40 PM', admin: { initials: 'AS', name: 'Admin Surabi N', email: 'admin@wrectifai.com', color: 'bg-blue-100 text-blue-600' }, action: 'LOGIN', actionColor: 'text-purple-600', module: 'Authentication', target: 'Admin Login', details: 'Admin logged in to\\nthe system', ip: '103.21.244.12', status: 'Success', statusColor: 'bg-green-50 text-green-600' },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Audit Logs</h1>
          <p className="text-sm text-slate-500">Track and monitor all critical activities across the platform.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
             <Calendar className="w-4 h-4" /> May 30 - Jun 29, 2024
          </button>
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm text-red-600">
            <FileText className="w-4 h-4" /> Export PDF
          </button>
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm text-green-600">
            <FileSpreadsheet className="w-4 h-4" /> Export Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-5 flex items-center gap-4 shadow-sm border-slate-200">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><FileText className="w-6 h-6"/></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Activities</p>
            <h3 className="text-2xl font-bold text-slate-800">18,642</h3>
            <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">↑ 15.3% vs last month</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4 shadow-sm border-slate-200">
          <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><CheckCircle2 className="w-6 h-6"/></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Successful Activities</p>
            <h3 className="text-2xl font-bold text-slate-800">17,892</h3>
            <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">↑ 16.8% vs last month</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4 shadow-sm border-slate-200">
          <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center"><AlertTriangle className="w-6 h-6"/></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Failed Activities</p>
            <h3 className="text-2xl font-bold text-slate-800">312</h3>
            <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">↓ 8.2% vs last month</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4 shadow-sm border-slate-200">
          <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center"><Users className="w-6 h-6"/></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Unique Admins</p>
            <h3 className="text-2xl font-bold text-slate-800">24</h3>
            <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">↑ 9.1% vs last month</p>
          </div>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-200">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="text" placeholder="Search by admin, action, module or details..." className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex items-center gap-3">
            <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 bg-white">
              <option>All Actions</option>
            </select>
            <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 bg-white">
              <option>All Modules</option>
            </select>
            <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 bg-white">
              <option>All Admins</option>
            </select>
            <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 bg-white">
              <option>All Status</option>
            </select>
            <button className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 bg-white hover:bg-slate-50">
              <Calendar className="w-4 h-4" /> Date Range
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 bg-white hover:bg-slate-50">
              <Filter className="w-4 h-4" /> More Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[11px] font-semibold text-slate-500 border-b border-slate-100 uppercase tracking-wider">
                <th className="p-4 whitespace-nowrap">Time & Date</th>
                <th className="p-4 whitespace-nowrap">Admin User</th>
                <th className="p-4 whitespace-nowrap">Action</th>
                <th className="p-4 whitespace-nowrap">Module</th>
                <th className="p-4 whitespace-nowrap">Target</th>
                <th className="p-4 whitespace-nowrap">Details</th>
                <th className="p-4 whitespace-nowrap">IP Address</th>
                <th className="p-4 whitespace-nowrap">Status</th>
                <th className="p-4 whitespace-nowrap text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((l, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-start gap-1.5">
                       <Clock className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                       <div>
                          <p className="text-[12px] font-medium text-slate-700">{l.date.split('\\n')[0]}</p>
                          <p className="text-[11px] text-slate-500">{l.date.split('\\n')[1]}</p>
                       </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={\`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 \${l.admin.color}\`}>{l.admin.initials}</div>
                      <div>
                        <p className="text-[13px] font-bold text-slate-900">{l.admin.name}</p>
                        <p className="text-[11px] text-slate-500">{l.admin.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={\`text-[11px] font-bold \${l.actionColor}\`}>{l.action}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                       {l.module.includes('Garage') && <span className="text-slate-400 text-[14px]">🏪</span>}
                       {l.module.includes('Customer') && <span className="text-slate-400 text-[14px]">👤</span>}
                       {l.module.includes('Service') && <span className="text-slate-400 text-[14px]">📋</span>}
                       {l.module.includes('Bookings') && <span className="text-slate-400 text-[14px]">📅</span>}
                       {l.module.includes('Quotes') && <span className="text-slate-400 text-[14px]">📄</span>}
                       {l.module.includes('Authentication') && <ShieldCheck className="w-4 h-4 text-slate-400" />}
                       <span className="text-[12px] font-medium text-slate-900">{l.module}</span>
                    </div>
                  </td>
                  <td className="p-4">
                     <p className="text-[12px] font-bold text-slate-900">{l.target.split('\\n')[0]}</p>
                     <p className="text-[10px] text-slate-500">{l.target.split('\\n')[1] || ''}</p>
                  </td>
                  <td className="p-4">
                     <p className="text-[11px] text-slate-700 whitespace-pre-line">{l.details}</p>
                  </td>
                  <td className="p-4">
                     <p className="text-[11px] font-medium text-slate-600">{l.ip}</p>
                  </td>
                  <td className="p-4">
                     <span className={\`px-2 py-1 rounded text-[11px] font-semibold \${l.statusColor}\`}>{l.status}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center">
                       <button className="w-8 h-8 rounded flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">Showing 1 to 10 of 18,642 activities</p>
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
              <button className="w-8 h-8 rounded flex items-center justify-center text-slate-600 hover:bg-slate-50">1865</button>
              <button className="w-8 h-8 rounded flex items-center justify-center text-slate-600 hover:bg-slate-50">&gt;</button>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-blue-600" /> All activities are recorded securely and cannot be modified.
           </div>
           <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <Clock className="w-4 h-4" /> Logs are retained for 1 year from the activity date.
           </div>
        </div>
      </Card>
    </div>
  );
}
`);
