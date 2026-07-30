'use client';
import { Card } from '@/components/common/card';
import { Search, Filter, Calendar, MoreVertical, Download, Eye, FileText, Clock, FileCheck2, Store, XCircle } from 'lucide-react';

export default function QuotesPage() {
  const quotes = [
    { id: 'QT-1082', ref: '#QT1082', customer: { initials: 'RS', name: 'Rahul Sharma', phone: '98765 43210', email: 'rahul.sharma@gmail.com' }, service: 'AC Service', vehicle: { reg: 'TS09 AB 1234', model: 'Hyundai i20 (2020)' }, garage: { name: 'SpeedFix Auto Care', location: 'Hyderabad, TS', rating: '4.6 (128 reviews)' }, amount: '₹1,850', breakup: 'Breakup (5 items)', status: 'Pending', statusColor: 'bg-orange-50 text-orange-600', validTill: '02 Aug, 2024\n11:59 PM', createdOn: '30 Jul, 2024\n10:15 AM' },
    { id: 'QT-1081', ref: '#QT1081', customer: { initials: 'PS', name: 'Priya Singh', phone: '91234 56780', email: 'priya.singh@gmail.com' }, service: 'Brake Inspection', vehicle: { reg: 'TS09 CD 5678', model: 'Maruti Swift (2019)' }, garage: { name: 'QuickPit Service Center', location: 'Secunderabad, TS', rating: '4.4 (96 reviews)' }, amount: '₹950', breakup: 'Breakup (3 items)', status: 'Accepted', statusColor: 'bg-green-50 text-green-600', validTill: '01 Aug, 2024\n11:59 PM', createdOn: '30 Jul, 2024\n09:45 AM' },
    { id: 'QT-1080', ref: '#QT1080', customer: { initials: 'AK', name: 'Arjun Kumar', phone: '90123 45678', email: 'arjun.kumar@gmail.com' }, service: 'Engine Oil Change', vehicle: { reg: 'TS09 EF 9012', model: 'Honda City (2021)' }, garage: { name: 'DriveWell Garage', location: 'Hyderabad, TS', rating: '4.5 (73 reviews)' }, amount: '₹1,200', breakup: 'Breakup (4 items)', status: 'Converted', statusColor: 'bg-blue-50 text-blue-600', validTill: '31 Jul, 2024\n11:59 PM', createdOn: '29 Jul, 2024\n04:20 PM' },
    { id: 'QT-1079', ref: '#QT1079', customer: { initials: 'SN', name: 'Sneha Nair', phone: '93456 78901', email: 'sneha.nair@gmail.com' }, service: 'Battery Replacement', vehicle: { reg: 'TS09 GH 3456', model: 'Tata Nexon (2020)' }, garage: { name: 'AutoWorks Garage', location: 'Kukatpally, TS', rating: '4.3 (58 reviews)' }, amount: '₹2,400', breakup: 'Breakup (6 items)', status: 'Expired', statusColor: 'bg-red-50 text-red-600', validTill: '29 Jul, 2024\n11:59 PM', createdOn: '27 Jul, 2024\n03:30 PM' },
    { id: 'QT-1078', ref: '#QT1078', customer: { initials: 'RK', name: 'Rohit Kapoor', phone: '77770 01122', email: 'rohit.kapoor@gmail.com' }, service: 'Suspension Check', vehicle: { reg: 'TS09 MN 9876', model: 'Kia Seltos (2021)' }, garage: { name: 'GearUp Garage', location: 'Dilsukhnagar, TS', rating: '4.2 (64 reviews)' }, amount: '₹3,100', breakup: 'Breakup (7 items)', status: 'Declined', statusColor: 'bg-slate-100 text-slate-600', validTill: '28 Jul, 2024\n11:59 PM', createdOn: '26 Jul, 2024\n02:10 PM' },
    { id: 'QT-1077', ref: '#QT1077', customer: { initials: 'LG', name: 'Lavanya Goud', phone: '90000 33445', email: 'lavanya.goud@gmail.com' }, service: 'Tyre Replacement', vehicle: { reg: 'TS09 ST 4455', model: 'Toyota Innova (2017)' }, garage: { name: 'TyreTech Solutions', location: 'Hyderabad, TS', rating: '4.6 (112 reviews)' }, amount: '₹4,800', breakup: 'Breakup (8 items)', status: 'Accepted', statusColor: 'bg-green-50 text-green-600', validTill: '28 Jul, 2024\n11:59 PM', createdOn: '26 Jul, 2024\n11:05 AM' },
    { id: 'QT-1076', ref: '#QT1076', customer: { initials: 'MJ', name: 'Meera Jain', phone: '93412 34567', email: 'meera.jain@gmail.com' }, service: 'General Service', vehicle: { reg: 'TS09 QR 2233', model: 'Hyundai Venue (2019)' }, garage: { name: 'PitStop Autos', location: 'Madhapur, TS', rating: '4.4 (101 reviews)' }, amount: '₹1,650', breakup: 'Breakup (5 items)', status: 'Pending', statusColor: 'bg-orange-50 text-orange-600', validTill: '02 Aug, 2024\n11:59 PM', createdOn: '25 Jul, 2024\n05:50 PM' },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quotes</h1>
          <p className="text-sm text-slate-500">Dashboard &gt; Quotes</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
            <span className="text-lg leading-none">+</span> New Quote
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-6">
        <Card className="p-4 flex items-center gap-3 shadow-sm border-slate-200">
          <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center"><FileText className="w-5 h-5"/></div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Quotes</p>
            <h3 className="text-xl font-bold text-slate-800">1,082</h3>
            <p className="text-[10px] text-green-600 font-medium mt-0.5 flex items-center gap-1">↑ 16% vs last month</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3 shadow-sm border-slate-200">
          <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center"><Clock className="w-5 h-5"/></div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Pending Quotes</p>
            <h3 className="text-xl font-bold text-slate-800">236</h3>
            <p className="text-[10px] text-green-600 font-medium mt-0.5 flex items-center gap-1">↑ 12% vs last month</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3 shadow-sm border-slate-200">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><FileCheck2 className="w-5 h-5"/></div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Accepted Quotes</p>
            <h3 className="text-xl font-bold text-slate-800">612</h3>
            <p className="text-[10px] text-green-600 font-medium mt-0.5 flex items-center gap-1">↑ 20% vs last month</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3 shadow-sm border-slate-200">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><Store className="w-5 h-5"/></div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Converted to Bookings</p>
            <h3 className="text-xl font-bold text-slate-800">478</h3>
            <p className="text-[10px] text-green-600 font-medium mt-0.5 flex items-center gap-1">↑ 15% vs last month</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3 shadow-sm border-slate-200">
          <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center"><XCircle className="w-5 h-5"/></div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Expired / Declined</p>
            <h3 className="text-xl font-bold text-slate-800">154</h3>
            <p className="text-[10px] text-red-600 font-medium mt-0.5 flex items-center gap-1">↓ 8% vs last month</p>
          </div>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-200">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="text" placeholder="Search by quote ID, customer, vehicle or garage..." className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex items-center gap-3">
            <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 bg-white">
              <option>All Status</option>
            </select>
            <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 bg-white">
              <option>All Services</option>
            </select>
            <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 bg-white">
              <option>All Garages</option>
            </select>
            <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 bg-white">
              <option>All Cities</option>
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
                <th className="p-4 whitespace-nowrap">Quote ID</th>
                <th className="p-4 whitespace-nowrap">Customer</th>
                <th className="p-4 whitespace-nowrap">Service & Vehicle</th>
                <th className="p-4 whitespace-nowrap">Garage</th>
                <th className="p-4 whitespace-nowrap">Quote Amount</th>
                <th className="p-4 whitespace-nowrap">Status</th>
                <th className="p-4 whitespace-nowrap">Valid Till</th>
                <th className="p-4 whitespace-nowrap">Created On</th>
                <th className="p-4 whitespace-nowrap text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quotes.map((q, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <p className="text-[13px] font-bold text-blue-600">{q.id}</p>
                    <p className="text-[10px] text-slate-400">{q.ref}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">{q.customer.initials}</div>
                      <div>
                        <p className="text-[13px] font-bold text-slate-900">{q.customer.name}</p>
                        <p className="text-[11px] text-slate-500">{q.customer.phone}</p>
                        <p className="text-[10px] text-slate-400">{q.customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-start gap-2">
                        <span className="text-slate-400 mt-0.5 text-[10px]">🛠️</span>
                        <p className="text-[12px] font-bold text-slate-900">{q.service}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-slate-400 mt-0.5 text-[10px]">🚗</span>
                        <div>
                          <p className="text-[12px] font-medium text-slate-700">{q.vehicle.model}</p>
                          <p className="text-[10px] text-slate-500">{q.vehicle.reg}</p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-start gap-2">
                      <span className="text-slate-400 mt-0.5">🏪</span>
                      <div>
                        <p className="text-[13px] font-bold text-slate-900">{q.garage.name}</p>
                        <p className="text-[11px] text-slate-500">{q.garage.location}</p>
                        <p className="text-[10px] text-green-600 mt-0.5 flex items-center gap-0.5">⭐ {q.garage.rating}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-[14px] font-bold text-slate-900">{q.amount}</p>
                    <p className="text-[10px] text-blue-600 font-medium cursor-pointer">{q.breakup}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[11px] font-semibold ${q.statusColor}`}>{q.status}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-start gap-1.5">
                       <Clock className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                       <div>
                          <p className="text-[12px] font-medium text-slate-700">{q.validTill.split('\n')[0]}</p>
                          <p className="text-[11px] text-slate-500">{q.validTill.split('\n')[1]}</p>
                       </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-start gap-1.5">
                       <Calendar className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                       <div>
                          <p className="text-[12px] font-medium text-slate-700">{q.createdOn.split('\n')[0]}</p>
                          <p className="text-[11px] text-slate-500">{q.createdOn.split('\n')[1]}</p>
                       </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                       <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 border border-blue-100 rounded-lg transition-colors whitespace-nowrap"><Eye className="w-3.5 h-3.5" /> View Details</button>
                       <button className="w-8 h-8 rounded flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">Showing 1 to 10 of 1,082 quotes</p>
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
              <button className="w-8 h-8 rounded flex items-center justify-center text-slate-600 hover:bg-slate-50">109</button>
              <button className="w-8 h-8 rounded flex items-center justify-center text-slate-600 hover:bg-slate-50">&gt;</button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
