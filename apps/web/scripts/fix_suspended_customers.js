const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/app/admin/users/suspended/page.tsx');

const newContent = `
'use client';
import { Card } from '@/components/common/card';
import { Search, UserX, MapPin, Car, MoreVertical } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

export default function SuspendedCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    try {
      const data = await apiClient.get<any[]>('/admin/users');
      setCustomers(data.filter(c => c.status?.toLowerCase() === 'suspended'));
    } catch (err) {
      console.error('Failed to load suspended customers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this customer?')) return;
    try {
      await apiClient.delete(\`/admin/users/\${id}\`);
      loadData();
    } catch (err) {
      console.error('Failed to delete customer', err);
    }
  };

  const filteredCustomers = customers.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.phone?.toLowerCase().includes(q);
  });

  const formatTime = (isoString: string) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
             <h1 className="text-2xl font-bold text-slate-900">Suspended Customers</h1>
             <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">{loading ? '-' : customers.length}</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Dashboard &gt; Customer Management &gt; Suspended Customers</p>
        </div>
      </div>

      <Card className="shadow-sm border-slate-200">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by name, email or phone number..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-xs font-semibold text-slate-500 border-b border-slate-100">
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Contact</th>
                <th className="p-4 font-semibold">Location</th>
                <th className="p-4 font-semibold">Joined On</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                 <tr><td colSpan={5} className="p-8 text-center text-sm text-slate-500">Loading...</td></tr>
              ) : filteredCustomers.length === 0 ? (
                 <tr>
                    <td colSpan={5} className="p-12 text-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                         <UserX className="w-8 h-8"/>
                      </div>
                      <p className="text-sm text-slate-500 font-medium">No suspended customers found.</p>
                    </td>
                 </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-red-100 text-red-600">
                          {c.name ? c.name.substring(0,2).toUpperCase() : 'CU'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                          <p className="text-xs text-slate-500">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-700">{c.phone || 'N/A'}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                         <MapPin className="w-3 h-3 text-slate-400" /> {c.location || 'N/A'}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-700">{formatTime(c.joined)}</td>
                    <td className="p-4 text-right">
                       <button onClick={() => handleDelete(c.id)} className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg">
                          Delete Customer
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
`;

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Suspended Customers page fixed.');
