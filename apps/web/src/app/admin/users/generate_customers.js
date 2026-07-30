const fs = require('fs');
const path = require('path');

const write = (filepath, content) => {
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filepath, content.trim() + '\n', 'utf8');
};

const adminUsersDir = 'd:/WRECTIFIAI/wrectifai/apps/web/src/app/admin/users';

// 1. All Customers
write(`${adminUsersDir}/page.tsx`, `
'use client';
import { Card } from '@/components/common/card';
import { Search, Filter, Download, MoreVertical, Eye, RotateCcw, Users, UserCheck, Clock, UserX, Car } from 'lucide-react';

export default function AllCustomersPage() {
  const customers = [
    { id: 1, initials: 'RA', name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', phone: '98765 43210', location: 'Hyderabad, TS', vehicles: 2, topVehicle: 'TS09 AB 1234', bookings: 12, lastBooking: '2 days ago', joined: '30 Jul, 2024', status: 'Active', bgColor: 'bg-blue-100 text-blue-600' },
    { id: 2, initials: 'PS', name: 'Priya Singh', email: 'priya.singh@gmail.com', phone: '91234 56780', location: 'Secunderabad, TS', vehicles: 1, topVehicle: 'TS09 CD 5678', bookings: 8, lastBooking: '1 week ago', joined: '28 Jul, 2024', status: 'Active', bgColor: 'bg-yellow-100 text-yellow-600' },
    { id: 3, initials: 'AK', name: 'Arjun Kumar', email: 'arjun.kumar@gmail.com', phone: '90123 45678', location: 'Hyderabad, TS', vehicles: 2, topVehicle: 'TS09 EF 9012', bookings: 15, lastBooking: '3 days ago', joined: '25 Jul, 2024', status: 'Active', bgColor: 'bg-purple-100 text-purple-600' },
    { id: 4, initials: 'SN', name: 'Sneha Nair', email: 'sneha.nair@gmail.com', phone: '93456 78901', location: 'Kukatpally, TS', vehicles: 1, topVehicle: 'TS09 GH 3456', bookings: 6, lastBooking: '5 days ago', joined: '22 Jul, 2024', status: 'Active', bgColor: 'bg-green-100 text-green-600' },
    { id: 5, initials: 'VK', name: 'Vikram Reddy', email: 'vikram.reddy@gmail.com', phone: '99001 12233', location: 'LB Nagar, TS', vehicles: 3, topVehicle: 'TS09 IJ 7890', bookings: 21, lastBooking: '1 day ago', joined: '20 Jul, 2024', status: 'Active', bgColor: 'bg-orange-100 text-orange-600' },
    { id: 6, initials: 'MP', name: 'Meera Patel', email: 'meera.patel@gmail.com', phone: '88888 97654', location: 'Madhapur, TS', vehicles: 1, topVehicle: 'TS09 KL 2345', bookings: 4, lastBooking: '2 weeks ago', joined: '18 Jul, 2024', status: 'Suspended', bgColor: 'bg-pink-100 text-pink-600' },
    { id: 7, initials: 'RK', name: 'Rohit Kapoor', email: 'rohit.kapoor@gmail.com', phone: '77770 01122', location: 'Dilsukhnagar, TS', vehicles: 2, topVehicle: 'TS09 MN 9876', bookings: 9, lastBooking: '4 days ago', joined: '15 Jul, 2024', status: 'Active', bgColor: 'bg-teal-100 text-teal-600' },
    { id: 8, initials: 'LG', name: 'Lavanya Goud', email: 'lavanya.goud@gmail.com', phone: '90000 33445', location: 'Banjara Hills, TS', vehicles: 1, topVehicle: 'TS09 OP 1122', bookings: 7, lastBooking: '6 days ago', joined: '12 Jul, 2024', status: 'Active', bgColor: 'bg-amber-100 text-amber-600' },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customer Management</h1>
          <p className="text-sm text-slate-500">Dashboard &gt; Customer Management &gt; All Customers</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
          <span className="text-lg leading-none">+</span> Add Customer
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-5 flex items-center gap-4 shadow-sm border-slate-200">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Users className="w-6 h-6"/></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Customers</p>
            <h3 className="text-2xl font-bold text-slate-800">2,548</h3>
            <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">↑ 24 this week</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4 shadow-sm border-slate-200">
          <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><UserCheck className="w-6 h-6"/></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Active Customers</p>
            <h3 className="text-2xl font-bold text-slate-800">2,312</h3>
            <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">↑ 18 this week</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4 shadow-sm border-slate-200">
          <div className="w-12 h-12 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center"><Clock className="w-6 h-6"/></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">New This Month</p>
            <h3 className="text-2xl font-bold text-slate-800">156</h3>
            <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">↑ 12 this week</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4 shadow-sm border-slate-200">
          <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center"><UserX className="w-6 h-6"/></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Suspended Customers</p>
            <h3 className="text-2xl font-bold text-slate-800">86</h3>
            <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">↓ 3 this week</p>
          </div>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-200">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="text" placeholder="Search by name, email, phone number..." className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>
          <div className="flex items-center gap-3">
            <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:border-blue-500 bg-white">
              <option>All Status</option>
            </select>
            <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:border-blue-500 bg-white">
              <option>All Cities</option>
            </select>
            <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:border-blue-500 bg-white">
              <option>All Vehicles</option>
            </select>
            <button className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
              <Filter className="w-4 h-4" /> More Filters
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        <div className="flex border-b border-slate-100">
          <button className="px-6 py-3 text-sm font-semibold text-blue-600 border-b-2 border-blue-600">All Customers (2548)</button>
          <button className="px-6 py-3 text-sm font-medium text-slate-500 hover:text-slate-700">Active (2312)</button>
          <button className="px-6 py-3 text-sm font-medium text-slate-500 hover:text-slate-700">Suspended (86)</button>
          <button className="px-6 py-3 text-sm font-medium text-slate-500 hover:text-slate-700">Unverified (150)</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-xs font-semibold text-slate-500 border-b border-slate-100">
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Contact</th>
                <th className="p-4 font-semibold">Location</th>
                <th className="p-4 font-semibold">Vehicles</th>
                <th className="p-4 font-semibold">Total Bookings</th>
                <th className="p-4 font-semibold">Joined On</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={\`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm \${c.bgColor}\`}>
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
                    <div className="flex items-center gap-2">
                       <span className="text-slate-400">📍</span>
                       <span className="text-sm text-slate-700">{c.location}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-semibold text-slate-700 flex items-center gap-1"><Car className="w-3.5 h-3.5 text-slate-400"/> {c.vehicles} {c.vehicles === 1 ? 'Vehicle' : 'Vehicles'}</p>
                    <p className="text-xs text-slate-500 mt-1">{c.topVehicle} {c.vehicles > 1 && <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[10px] ml-1">+{c.vehicles - 1}</span>}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-semibold text-slate-700">{c.bookings}</p>
                    <p className="text-xs text-slate-500 mt-1">Last: {c.lastBooking}</p>
                  </td>
                  <td className="p-4 text-sm text-slate-700 whitespace-nowrap">{c.joined}</td>
                  <td className="p-4">
                    <span className={\`px-2.5 py-1 rounded-full text-xs font-semibold \${c.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}\`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"><Eye className="w-4 h-4" /></button>
                      {c.status === 'Suspended' ? 
                         <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"><RotateCcw className="w-4 h-4" /></button> :
                         <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"><UserX className="w-4 h-4" /></button>
                      }
                      <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">Showing 1 to 8 of 2,548 customers</p>
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
              <button className="w-8 h-8 rounded flex items-center justify-center text-slate-600 hover:bg-slate-50">255</button>
              <button className="w-8 h-8 rounded flex items-center justify-center text-slate-600 hover:bg-slate-50">&gt;</button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
`);

// 2. Customer Verification
write(`${adminUsersDir}/verification/page.tsx`, `
'use client';
import { Card } from '@/components/common/card';
import { Search, Filter, Eye, UserCheck, Clock, FileText, CheckCircle2, ShieldAlert, FileWarning, AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

export default function CustomerVerificationPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(1);

  const verifications = [
    { id: 1, initials: 'RS', name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', phone: '98765 43210', submittedOn: '30 Jul, 2024\\n10:30 AM', documents: ['Aadhaar', 'PAN Card'], extraDocs: 2, status: 'Pending', bgColor: 'bg-purple-100 text-purple-600' },
    { id: 2, initials: 'PS', name: 'Priya Singh', email: 'priya.singh@gmail.com', phone: '91234 56780', submittedOn: '30 Jul, 2024\\n09:15 AM', documents: ['Aadhaar', 'Driving License'], extraDocs: 1, status: 'Pending', bgColor: 'bg-yellow-100 text-yellow-600' },
    { id: 3, initials: 'AK', name: 'Arjun Kumar', email: 'arjun.kumar@gmail.com', phone: '90123 45678', submittedOn: '29 Jul, 2024\\n04:20 PM', documents: ['Aadhaar', 'PAN Card'], extraDocs: 1, status: 'Pending', bgColor: 'bg-blue-100 text-blue-600' },
    { id: 4, initials: 'SN', name: 'Sneha Nair', email: 'sneha.nair@gmail.com', phone: '93456 78901', submittedOn: '29 Jul, 2024\\n02:45 PM', documents: ['Aadhaar', 'Address Proof'], extraDocs: 1, status: 'Pending', bgColor: 'bg-green-100 text-green-600' },
    { id: 5, initials: 'VK', name: 'Vikram Reddy', email: 'vikram.reddy@gmail.com', phone: '99001 12233', submittedOn: '28 Jul, 2024\\n11:05 AM', documents: ['Aadhaar', 'Driving License'], extraDocs: 2, status: 'Pending', bgColor: 'bg-red-100 text-red-600' },
    { id: 6, initials: 'MP', name: 'Meera Patel', email: 'meera.patel@gmail.com', phone: '88888 97654', submittedOn: '28 Jul, 2024\\n10:50 AM', documents: ['Aadhaar', 'PAN Card'], extraDocs: 1, status: 'Pending', bgColor: 'bg-purple-100 text-purple-600' },
    { id: 7, initials: 'RK', name: 'Rohit Kapoor', email: 'rohit.kapoor@gmail.com', phone: '77770 01122', submittedOn: '27 Jul, 2024\\n06:30 PM', documents: ['Aadhaar', 'Address Proof'], extraDocs: 1, status: 'Pending', bgColor: 'bg-green-100 text-green-600' },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen flex gap-6">
      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Customer Verification</h1>
          <p className="text-sm text-slate-500">Dashboard &gt; Customer Management &gt; Customer Verification</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="p-5 flex items-center gap-4 shadow-sm border-slate-200">
            <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center"><UserCheck className="w-6 h-6"/></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Pending Verification</p>
              <h3 className="text-2xl font-bold text-slate-800">150</h3>
              <p className="text-xs text-purple-600 font-medium mt-1">Requires Review</p>
            </div>
          </Card>
          <Card className="p-5 flex items-center gap-4 shadow-sm border-slate-200">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center"><FileText className="w-6 h-6"/></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Verified This Month</p>
              <h3 className="text-2xl font-bold text-slate-800">328</h3>
              <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">↑ 18% vs last month</p>
            </div>
          </Card>
          <Card className="p-5 flex items-center gap-4 shadow-sm border-slate-200">
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><ShieldAlert className="w-6 h-6"/></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Verified Customers</p>
              <h3 className="text-2xl font-bold text-slate-800">2,312</h3>
              <p className="text-xs text-green-600 font-medium mt-1">Total Verified</p>
            </div>
          </Card>
          <Card className="p-5 flex items-center gap-4 shadow-sm border-slate-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center"><AlertTriangle className="w-6 h-6"/></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Rejected This Month</p>
              <h3 className="text-2xl font-bold text-slate-800">42</h3>
              <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">↓ 6% vs last month</p>
            </div>
          </Card>
        </div>

        <Card className="shadow-sm border-slate-200">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input type="text" placeholder="Search by name, email or phone..." className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>
            <div className="flex items-center gap-3">
              <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 focus:outline-none bg-white">
                <option>All Status</option>
              </select>
              <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 focus:outline-none bg-white">
                <option>All Documents</option>
              </select>
              <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 focus:outline-none bg-white">
                <option>All Cities</option>
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

          <div className="flex border-b border-slate-100">
            <button className="px-6 py-3 text-sm font-semibold text-blue-600 border-b-2 border-blue-600">Pending (150)</button>
            <button className="px-6 py-3 text-sm font-medium text-slate-500 hover:text-slate-700">Verified (2312)</button>
            <button className="px-6 py-3 text-sm font-medium text-slate-500 hover:text-slate-700">Rejected (42)</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-xs font-semibold text-slate-500 border-b border-slate-100">
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Contact</th>
                  <th className="p-4 font-semibold">Submitted On</th>
                  <th className="p-4 font-semibold">Documents</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {verifications.map((v) => (
                  <tr key={v.id} className={\`hover:bg-slate-50/50 transition-colors cursor-pointer \${selectedCustomer === v.id ? 'bg-blue-50/30' : ''}\`} onClick={() => setSelectedCustomer(v.id)}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={\`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm \${v.bgColor}\`}>
                          {v.initials}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{v.name}</p>
                          <p className="text-xs text-slate-500">{v.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-slate-700 flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">📞</div> {v.phone}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-1"><div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">✉️</div> {v.email}</div>
                    </td>
                    <td className="p-4 text-sm text-slate-700 whitespace-pre-line">{v.submittedOn}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2 items-center">
                         {v.documents.map((doc, i) => (
                           <div key={i} className="flex flex-col items-center">
                              <FileText className="w-5 h-5 text-slate-400 mb-1" />
                              <span className="text-[10px] text-slate-500">{doc}</span>
                           </div>
                         ))}
                         {v.extraDocs > 0 && (
                           <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-semibold">
                             +{v.extraDocs}
                           </div>
                         )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-600">
                        {v.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100"><Eye className="w-3.5 h-3.5" /> View</button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-green-100"><CheckCircle2 className="w-3.5 h-3.5" /> Verify</button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100">Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500">Showing 1 to 7 of 150 pending verifications</p>
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
                <button className="w-8 h-8 rounded flex items-center justify-center text-slate-600 hover:bg-slate-50">15</button>
                <button className="w-8 h-8 rounded flex items-center justify-center text-slate-600 hover:bg-slate-50">&gt;</button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Customer Preview Side Panel */}
      {selectedCustomer && (
        <Card className="w-[380px] shadow-sm border-slate-200 flex flex-col h-[calc(100vh-3rem)] sticky top-6">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
             <h2 className="text-base font-bold text-slate-900">Customer Preview</h2>
             <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
          </div>
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="flex gap-4 items-start mb-8">
               <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl bg-purple-100 text-purple-600">
                  RS
               </div>
               <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">Rahul Sharma</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-50 text-orange-600">Pending</span>
                  </div>
                  <div className="mt-2 space-y-1">
                     <p className="text-sm text-slate-600 flex items-center gap-2"><span className="text-slate-400">📞</span> 98765 43210</p>
                     <p className="text-sm text-slate-600 flex items-center gap-2"><span className="text-slate-400">✉️</span> rahul.sharma@gmail.com</p>
                     <p className="text-sm text-slate-600 flex items-center gap-2"><span className="text-slate-400">📍</span> Hyderabad, Telangana</p>
                     <p className="text-sm text-slate-600 flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-slate-400"/> Joined on 30 Jul, 2024</p>
                  </div>
               </div>
            </div>

            <div className="mb-8">
               <h4 className="text-sm font-bold text-slate-900 mb-3">Submitted Documents</h4>
               <div className="flex gap-3">
                 <div className="w-20">
                   <div className="w-full h-24 bg-slate-100 rounded border border-slate-200 mb-2 flex flex-col items-center justify-center">
                     <div className="w-12 h-8 bg-white border border-slate-200 rounded-sm mb-1"></div>
                     <span className="text-[8px] text-slate-400">Aadhaar Card</span>
                   </div>
                   <p className="text-[10px] text-slate-700 text-center font-medium">Aadhaar Card</p>
                   <p className="text-[10px] text-green-600 text-center font-medium flex items-center justify-center gap-1 mt-0.5"><CheckCircle2 className="w-3 h-3"/> Verified</p>
                 </div>
                 <div className="w-20">
                   <div className="w-full h-24 bg-slate-100 rounded border border-slate-200 mb-2 flex flex-col items-center justify-center">
                     <div className="w-12 h-8 bg-blue-50 border border-blue-200 rounded-sm mb-1"></div>
                     <span className="text-[8px] text-slate-400">PAN Card</span>
                   </div>
                   <p className="text-[10px] text-slate-700 text-center font-medium">PAN Card</p>
                   <p className="text-[10px] text-orange-600 text-center font-medium flex items-center justify-center gap-1 mt-0.5"><Clock className="w-3 h-3"/> Pending</p>
                 </div>
                 <div className="w-20">
                   <div className="w-full h-24 bg-slate-100 rounded border border-slate-200 mb-2 flex flex-col items-center justify-center text-slate-400">
                     <FileText className="w-6 h-6 mb-1"/>
                   </div>
                   <p className="text-[10px] text-slate-700 text-center font-medium">Address Proof</p>
                   <p className="text-[10px] text-orange-600 text-center font-medium flex items-center justify-center gap-1 mt-0.5"><Clock className="w-3 h-3"/> Pending</p>
                 </div>
                 <div className="w-12 flex items-center justify-center">
                   <span className="text-sm font-semibold text-slate-500">+2<br/><span className="text-[10px]">More</span></span>
                 </div>
               </div>
            </div>

            <div className="mb-8">
               <h4 className="text-sm font-bold text-slate-900 mb-3">Customer Information</h4>
               <div className="space-y-3">
                 <div className="grid grid-cols-[100px_1fr] text-sm">
                   <span className="text-slate-500">Full Name</span>
                   <span className="font-medium text-slate-900">Rahul Sharma</span>
                 </div>
                 <div className="grid grid-cols-[100px_1fr] text-sm">
                   <span className="text-slate-500">Date of Birth</span>
                   <span className="font-medium text-slate-900">12 Mar 1996</span>
                 </div>
                 <div className="grid grid-cols-[100px_1fr] text-sm">
                   <span className="text-slate-500">Gender</span>
                   <span className="font-medium text-slate-900">Male</span>
                 </div>
                 <div className="grid grid-cols-[100px_1fr] text-sm">
                   <span className="text-slate-500">Address</span>
                   <span className="font-medium text-slate-900">H No 12-3-45, Kukatpally,<br/>Hyderabad, Telangana - 500072</span>
                 </div>
                 <div className="grid grid-cols-[100px_1fr] text-sm">
                   <span className="text-slate-500">Occupation</span>
                   <span className="font-medium text-slate-900">Software Engineer</span>
                 </div>
               </div>
            </div>

            <div>
               <h4 className="text-sm font-bold text-slate-900 mb-2">Verification Notes</h4>
               <textarea className="w-full h-24 p-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 resize-none" placeholder="Add notes about verification..."></textarea>
               <p className="text-[10px] text-slate-400 text-right mt-1">0/200</p>
            </div>
          </div>
          <div className="p-4 border-t border-slate-100 flex gap-3">
             <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"><CheckCircle2 className="w-4 h-4"/> Verify Customer</button>
             <button className="flex-1 bg-white border border-red-200 hover:bg-red-50 text-red-600 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"><X className="w-4 h-4"/> Reject Customer</button>
          </div>
        </Card>
      )}
    </div>
  );
}
`);

// 3. Suspended Customers
write(`${adminUsersDir}/suspended/page.tsx`, `
'use client';
import { Card } from '@/components/common/card';
import { Search, Filter, Download, MoreVertical, AlertTriangle, FileWarning, RotateCcw, XCircle, Clock, ShieldAlert, UserX, Flag } from 'lucide-react';

export default function SuspendedCustomersPage() {
  const suspendedCustomers = [
    { id: 1, initials: 'MK', name: 'Manoj Kumar', email: 'manoj.kumar@gmail.com', phone: '98765 43210', reason: 'Policy Violations', reasonDesc: 'Multiple policy violations reported', icon: AlertTriangle, iconColor: 'text-red-500', iconBg: 'bg-red-50', badges: '+2', suspendedOn: '30 Jul, 2024\\n10:30 AM', suspendedBy: 'Admin\\nSurabi N', bgColor: 'bg-pink-100 text-pink-600' },
    { id: 2, initials: 'RS', name: 'Rohit Sharma', email: 'rohit.sharma@gmail.com', phone: '91234 56780', reason: 'Fraudulent Activity', reasonDesc: 'Found suspicious transaction pattern', icon: ShieldAlert, iconColor: 'text-orange-500', iconBg: 'bg-orange-50', badges: null, suspendedOn: '29 Jul, 2024\\n04:20 PM', suspendedBy: 'Admin\\nSurabi N', bgColor: 'bg-green-100 text-green-600' },
    { id: 3, initials: 'VS', name: 'Vikram Singh', email: 'vikram.singh@gmail.com', phone: '90123 45678', reason: 'Invalid Information', reasonDesc: 'Submitted invalid documents', icon: FileWarning, iconColor: 'text-red-500', iconBg: 'bg-red-50', badges: null, suspendedOn: '28 Jul, 2024\\n01:15 PM', suspendedBy: 'Admin\\nSurabi N', bgColor: 'bg-yellow-100 text-yellow-600' },
    { id: 4, initials: 'SP', name: 'Sneha Patel', email: 'sneha.patel@gmail.com', phone: '93456 78901', reason: 'Abusive Behavior', reasonDesc: 'Inappropriate behavior towards garage', icon: UserX, iconColor: 'text-orange-500', iconBg: 'bg-orange-50', badges: null, suspendedOn: '27 Jul, 2024\\n11:05 AM', suspendedBy: 'Admin\\nSurabi N', bgColor: 'bg-purple-100 text-purple-600' },
    { id: 5, initials: 'AK', name: 'Arjun Kumar', email: 'arjun.kumar@gmail.com', phone: '90001 12233', reason: 'Payment Issues', reasonDesc: 'Failed to settle platform dues', icon: XCircle, iconColor: 'text-red-500', iconBg: 'bg-red-50', badges: null, suspendedOn: '25 Jul, 2024\\n09:30 AM', suspendedBy: 'Admin\\nSurabi N', bgColor: 'bg-blue-100 text-blue-600' },
    { id: 6, initials: 'NP', name: 'Neha Priya', email: 'neha.priya@gmail.com', phone: '88888 97654', reason: 'Account Misuse', reasonDesc: 'Misuse of account privileges', icon: UserX, iconColor: 'text-red-500', iconBg: 'bg-red-50', badges: null, suspendedOn: '24 Jul, 2024\\n03:45 PM', suspendedBy: 'Admin\\nSurabi N', bgColor: 'bg-purple-100 text-purple-600' },
    { id: 7, initials: 'DK', name: 'Deepak Kumar', email: 'deepak.kumar@gmail.com', phone: '77770 01122', reason: 'No Show / Cancellation', reasonDesc: 'Repeated no show and cancellations', icon: Clock, iconColor: 'text-orange-500', iconBg: 'bg-orange-50', badges: null, suspendedOn: '22 Jul, 2024\\n02:20 PM', suspendedBy: 'Admin\\nSurabi N', bgColor: 'bg-green-100 text-green-600' },
    { id: 8, initials: 'PJ', name: 'Pooja Jain', email: 'pooja.jain@gmail.com', phone: '93412 34567', reason: 'Other Violations', reasonDesc: 'Violation of platform guidelines', icon: Flag, iconColor: 'text-red-500', iconBg: 'bg-red-50', badges: null, suspendedOn: '20 Jul, 2024\\n05:10 PM', suspendedBy: 'Admin\\nSurabi N', bgColor: 'bg-red-100 text-red-600' },
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
                      <div className={\`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm \${c.bgColor}\`}>
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
                       <c.icon className={\`w-4 h-4 mt-0.5 \${c.iconColor}\`} />
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
`);
