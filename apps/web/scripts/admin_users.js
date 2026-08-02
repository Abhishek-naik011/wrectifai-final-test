const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/app/admin/users/page.tsx');
let content = `
'use client';
import { Card } from '@/components/common/card';
import { Search, Eye, Users, UserCheck, Clock, UserX, Car, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/common/modal';

export default function AllCustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await apiClient.get<any[]>('/admin/users');
        setCustomers(data);
      } catch (err) {
        console.error('Failed to load customers', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active' || c.status === 'Active').length;
  const suspendedCustomers = customers.filter(c => c.status === 'suspended' || c.status === 'Suspended').length;
  const unverifiedCustomers = customers.filter(c => c.status === 'pending' || c.status === 'Pending').length;

  const filteredCustomers = customers.filter(c => {
     if (activeTab === 'active' && c.status?.toLowerCase() !== 'active') return false;
     if (activeTab === 'suspended' && c.status?.toLowerCase() !== 'suspended') return false;
     if (activeTab === 'unverified' && c.status?.toLowerCase() !== 'pending') return false;
     
     if (searchQuery) {
         const q = searchQuery.toLowerCase();
         return c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.phone?.toLowerCase().includes(q);
     }
     return true;
  });

  const formatTime = (isoString: string) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customer Management</h1>
          <p className="text-sm text-slate-500">Dashboard &gt; Customer Management &gt; All Customers</p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setIsVerificationOpen(true)} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
             Verify Customer
           </button>
           <button onClick={() => setIsAddCustomerOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
             <span className="text-lg leading-none">+</span> Add Customer
           </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-5 flex items-center gap-4 shadow-sm border-slate-200">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Users className="w-6 h-6"/></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Customers</p>
            <h3 className="text-2xl font-bold text-slate-800">{loading ? '-' : totalCustomers}</h3>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4 shadow-sm border-slate-200">
          <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><UserCheck className="w-6 h-6"/></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Active Customers</p>
            <h3 className="text-2xl font-bold text-slate-800">{loading ? '-' : activeCustomers}</h3>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4 shadow-sm border-slate-200">
          <div className="w-12 h-12 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center"><Clock className="w-6 h-6"/></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Unverified</p>
            <h3 className="text-2xl font-bold text-slate-800">{loading ? '-' : unverifiedCustomers}</h3>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4 shadow-sm border-slate-200">
          <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center"><UserX className="w-6 h-6"/></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Suspended</p>
            <h3 className="text-2xl font-bold text-slate-800">{loading ? '-' : suspendedCustomers}</h3>
          </div>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-200">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="text" placeholder="Search by name, email, phone number..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>
        </div>

        <div className="flex border-b border-slate-100">
          <button onClick={() => setActiveTab('all')} className={\`px-6 py-3 text-sm font-semibold \${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}\`}>All Customers ({totalCustomers})</button>
          <button onClick={() => setActiveTab('active')} className={\`px-6 py-3 text-sm font-semibold \${activeTab === 'active' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}\`}>Active ({activeCustomers})</button>
          <button onClick={() => setActiveTab('suspended')} className={\`px-6 py-3 text-sm font-semibold \${activeTab === 'suspended' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}\`}>Suspended ({suspendedCustomers})</button>
          <button onClick={() => setActiveTab('unverified')} className={\`px-6 py-3 text-sm font-semibold \${activeTab === 'unverified' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}\`}>Unverified ({unverifiedCustomers})</button>
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
              {loading ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-500 text-sm">Loading customers...</td>
                  </tr>
              ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-500 text-sm">No customers found.</td>
                  </tr>
              ) : filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-blue-100 text-blue-600">
                        {c.name ? c.name.substring(0,2).toUpperCase() : 'CU'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                        <p className="text-xs text-slate-500">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-slate-700">{c.phone || 'N/A'}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                       <MapPin className="w-3 h-3 inline-block text-slate-400" />
                       <span className="text-sm text-slate-700">{c.location || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-semibold text-slate-700 flex items-center gap-1"><Car className="w-3.5 h-3.5 text-slate-400"/> {c.vehicles || 0}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-semibold text-slate-700">{c.bookings || 0}</p>
                  </td>
                  <td className="p-4 text-sm text-slate-700 whitespace-nowrap">{formatTime(c.joined)}</td>
                  <td className="p-4">
                    <span className={\`px-2.5 py-1 rounded-full text-xs font-semibold \${c.status?.toLowerCase() === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}\`}>
                      {c.status || 'Active'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => router.push('/coming-soon')} className="w-8 h-8 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"><Eye className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Modals */}
      <Modal isOpen={isAddCustomerOpen} onClose={() => setIsAddCustomerOpen(false)} title="Add Customer">
         <div className="space-y-4">
            <p className="text-sm text-slate-500">Feature Coming Soon: Adding customers manually from admin panel is under development.</p>
            <button onClick={() => setIsAddCustomerOpen(false)} className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">Close</button>
         </div>
      </Modal>

      <Modal isOpen={isVerificationOpen} onClose={() => setIsVerificationOpen(false)} title="Customer Verification">
         <div className="space-y-4">
            <p className="text-sm text-slate-500">Feature Coming Soon: Customer Verification flow is under development.</p>
            <button onClick={() => setIsVerificationOpen(false)} className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">Close</button>
         </div>
      </Modal>
    </div>
  );
}
`;

fs.writeFileSync(file, content, 'utf8');
console.log('Replaced Admin Customers content successfully.');
