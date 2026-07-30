'use client';
import { Card } from '@/components/common/card';
import { Search, Filter, Calendar as CalendarIcon, MoreVertical, FileText, Clock, PlayCircle, CheckCircle2, XCircle, Eye } from 'lucide-react';

export default function AllServiceRequestsPage() {
  const requests = [
    { id: 'SR-1256', customerInitials: 'RS', customerName: 'Rahul Sharma', customerPhone: '98765 43210', garageName: 'SpeedFix Auto Care', garageLocation: 'Hyderabad, TS', serviceName: 'Brake Inspection', serviceCategory: 'General Service', vehicleReg: 'TS09 AB 1234', vehicleModel: 'Hyundai i20 (2020)', status: 'Pending', statusColor: 'bg-orange-50 text-orange-600', priority: 'Medium', requestedOn: '30 Jul, 2024\n10:30 AM' },
    { id: 'SR-1255', customerInitials: 'PS', customerName: 'Priya Singh', customerPhone: '91234 56780', garageName: 'QuickPit Service Center', garageLocation: 'Secunderabad, TS', serviceName: 'AC Not Cooling', serviceCategory: 'Electrical', vehicleReg: 'TS09 CD 5678', vehicleModel: 'Maruti Swift (2019)', status: 'In Progress', statusColor: 'bg-blue-50 text-blue-600', priority: 'High', requestedOn: '30 Jul, 2024\n09:15 AM' },
    { id: 'SR-1254', customerInitials: 'AK', customerName: 'Arjun Kumar', customerPhone: '90123 45678', garageName: 'DriveWell Garage', garageLocation: 'Hyderabad, TS', serviceName: 'Engine Oil Change', serviceCategory: 'General Service', vehicleReg: 'TS09 EF 9012', vehicleModel: 'Honda City (2021)', status: 'Completed', statusColor: 'bg-green-50 text-green-600', priority: 'Low', requestedOn: '29 Jul, 2024\n04:20 PM' },
    { id: 'SR-1253', customerInitials: 'SN', customerName: 'Sneha Nair', customerPhone: '93456 78901', garageName: 'AutoWorks Garage', garageLocation: 'Kukatpally, TS', serviceName: 'Clutch Replacement', serviceCategory: 'Transmission', vehicleReg: 'TS09 GH 3456', vehicleModel: 'Tata Nexon (2020)', status: 'Pending', statusColor: 'bg-orange-50 text-orange-600', priority: 'Medium', requestedOn: '29 Jul, 2024\n02:45 PM' },
    { id: 'SR-1252', customerInitials: 'VK', customerName: 'Vikram Reddy', customerPhone: '99001 12233', garageName: 'Master Garage', garageLocation: 'LB Nagar, TS', serviceName: 'Battery Replacement', serviceCategory: 'Electrical', vehicleReg: 'TS09 IJ 7890', vehicleModel: 'Mahindra XUV500 (2018)', status: 'In Progress', statusColor: 'bg-blue-50 text-blue-600', priority: 'High', requestedOn: '29 Jul, 2024\n11:05 AM' },
    { id: 'SR-1251', customerInitials: 'MP', customerName: 'Meera Patel', customerPhone: '88888 97654', garageName: 'PitStop Autos', garageLocation: 'Madhapur, TS', serviceName: 'Tyre Alignment', serviceCategory: 'Wheel Service', vehicleReg: 'TS09 KL 2345', vehicleModel: 'Volkswagen Polo (2019)', status: 'Completed', statusColor: 'bg-green-50 text-green-600', priority: 'Low', requestedOn: '28 Jul, 2024\n10:50 AM' },
    { id: 'SR-1250', customerInitials: 'RK', customerName: 'Rohit Kapoor', customerPhone: '77770 01122', garageName: 'GearUp Garage', garageLocation: 'Dilsukhnagar, TS', serviceName: 'Suspension Check', serviceCategory: 'General Service', vehicleReg: 'TS09 MN 9876', vehicleModel: 'Kia Seltos (2021)', status: 'Cancelled', statusColor: 'bg-red-50 text-red-600', priority: 'Medium', requestedOn: '27 Jul, 2024\n06:30 PM' },
    { id: 'SR-1249', customerInitials: 'LG', customerName: 'Lavanya Goud', customerPhone: '90000 33445', garageName: 'QuickFix Hub', garageLocation: 'Banjara Hills, TS', serviceName: 'Wiper Replacement', serviceCategory: 'General Service', vehicleReg: 'TS09 OP 1122', vehicleModel: 'Maruti Baleno (2020)', status: 'Pending', statusColor: 'bg-orange-50 text-orange-600', priority: 'Low', requestedOn: '27 Jul, 2024\n05:10 PM' },
    { id: 'SR-1248', customerInitials: 'PJ', customerName: 'Pooja Jain', customerPhone: '93412 34567', garageName: 'SpeedFix Auto Care', garageLocation: 'Hyderabad, TS', serviceName: 'Door Lock Issue', serviceCategory: 'Electrical', vehicleReg: 'TS09 QR 2233', vehicleModel: 'Hyundai Venue (2019)', status: 'In Progress', statusColor: 'bg-blue-50 text-blue-600', priority: 'High', requestedOn: '26 Jul, 2024\n03:20 PM' },
    { id: 'SR-1247', customerInitials: 'DS', customerName: 'Deepak Singh', customerPhone: '89123 45678', garageName: 'AutoCare Pro', garageLocation: 'Secunderabad, TS', serviceName: 'General Checkup', serviceCategory: 'General Service', vehicleReg: 'TS09 ST 4455', vehicleModel: 'Toyota Innova (2017)', status: 'Completed', statusColor: 'bg-green-50 text-green-600', priority: 'Low', requestedOn: '26 Jul, 2024\n12:40 PM' },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Service Requests</h1>
          <p className="text-sm text-slate-500">Dashboard &gt; Service Requests &gt; All Requests</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
          <span className="text-lg leading-none">+</span> New Service Request
        </button>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-6">
        <Card className="p-4 flex items-center gap-3 shadow-sm border-slate-200">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><FileText className="w-5 h-5"/></div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Requests</p>
            <h3 className="text-xl font-bold text-slate-800">1,256</h3>
            <p className="text-[10px] text-green-600 font-medium mt-0.5 flex items-center gap-1">↑ 18% vs last month</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3 shadow-sm border-slate-200">
          <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center"><Clock className="w-5 h-5"/></div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Pending Requests</p>
            <h3 className="text-xl font-bold text-slate-800">312</h3>
            <p className="text-[10px] text-green-600 font-medium mt-0.5 flex items-center gap-1">↑ 8% vs last month</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3 shadow-sm border-slate-200">
          <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center"><PlayCircle className="w-5 h-5"/></div>
          <div>
            <p className="text-xs text-slate-500 font-medium">In Progress</p>
            <h3 className="text-xl font-bold text-slate-800">426</h3>
            <p className="text-[10px] text-green-600 font-medium mt-0.5 flex items-center gap-1">↑ 12% vs last month</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3 shadow-sm border-slate-200">
          <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><CheckCircle2 className="w-5 h-5"/></div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Completed</p>
            <h3 className="text-xl font-bold text-slate-800">478</h3>
            <p className="text-[10px] text-green-600 font-medium mt-0.5 flex items-center gap-1">↑ 15% vs last month</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3 shadow-sm border-slate-200">
          <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center"><XCircle className="w-5 h-5"/></div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Cancelled</p>
            <h3 className="text-xl font-bold text-slate-800">40</h3>
            <p className="text-[10px] text-red-600 font-medium mt-0.5 flex items-center gap-1">↓ 5% vs last month</p>
          </div>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-200">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="text" placeholder="Search by request ID, customer, garage, service..." className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
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
              <CalendarIcon className="w-4 h-4" /> Date Range
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 bg-white hover:bg-slate-50">
              <Filter className="w-4 h-4" /> More Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-xs font-semibold text-slate-500 border-b border-slate-100">
                <th className="p-4">Request ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Garage</th>
                <th className="p-4">Service</th>
                <th className="p-4">Vehicle</th>
                <th className="p-4">Status</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Requested On</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <p className="text-sm font-semibold text-slate-900">{r.id.replace('SR-', 'SR-')}</p>
                    <p className="text-xs text-slate-400">#{r.id.replace('-', '')}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">{r.customerInitials}</div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{r.customerName}</p>
                        <p className="text-[10px] text-slate-500">{r.customerPhone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-start gap-2">
                      <span className="text-slate-400 mt-0.5">🏪</span>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{r.garageName}</p>
                        <p className="text-[10px] text-slate-500">{r.garageLocation}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-medium text-slate-900">{r.serviceName}</p>
                    <p className="text-[10px] text-slate-500">{r.serviceCategory}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-start gap-2">
                      <span className="text-slate-400 mt-0.5">🚗</span>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{r.vehicleReg}</p>
                        <p className="text-[10px] text-slate-500">{r.vehicleModel}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-semibold ${r.statusColor}`}>{r.status}</span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-medium ${r.priority === 'High' ? 'text-red-500' : r.priority === 'Medium' ? 'text-orange-500' : 'text-green-500'}`}>{r.priority}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-start gap-2">
                       <CalendarIcon className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                       <p className="text-xs text-slate-700 whitespace-pre-line">{r.requestedOn}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="w-8 h-8 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-50 border border-blue-100 transition-colors"><Eye className="w-4 h-4" /></button>
                      <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-50 border border-slate-100 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">Showing 1 to 10 of 1,256 requests</p>
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
              <button className="w-8 h-8 rounded flex items-center justify-center text-slate-600 hover:bg-slate-50">126</button>
              <button className="w-8 h-8 rounded flex items-center justify-center text-slate-600 hover:bg-slate-50">&gt;</button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
