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
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${c.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
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
