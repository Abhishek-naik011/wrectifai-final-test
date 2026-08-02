
'use client';
import { Card } from '@/components/common/card';
import { Search, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { Modal } from '@/components/common/modal';

export default function CustomerVerificationPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    try {
      const data = await apiClient.get<any[]>('/admin/users');
      // For verification, maybe show pending or all. We will show all but you can verify/reject
      setCustomers(data);
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAction = async (id: string, action: string) => {
    try {
      await apiClient.post(`/admin/users/${id}/${action}`);
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const filtered = customers.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q);
  });

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6">
         <h1 className="text-2xl font-bold text-slate-900">Customer Verification</h1>
      </div>

      <Card className="shadow-sm border-slate-200">
        <div className="p-4 border-b border-slate-100 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search customers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" 
            />
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-50/50 text-xs font-semibold text-slate-500 border-b border-slate-100">
                <th className="p-4 font-semibold w-1/3">Name</th>
                <th className="p-4 font-semibold w-1/3">Status</th>
                <th className="p-4 font-semibold w-1/3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                 <tr><td colSpan={3} className="p-8 text-center text-sm text-slate-500">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                 <tr><td colSpan={3} className="p-8 text-center text-sm text-slate-500">No Records Found.</td></tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-sm font-semibold text-slate-900">{c.name}</td>
                    <td className="p-4 text-sm text-slate-700">{c.status}</td>
                    <td className="p-4 text-right">
                       <button onClick={() => { setSelectedCustomer(c); setIsModalOpen(true); }} className="text-slate-400 hover:text-blue-600 transition-colors px-2">
                         <Eye className="w-4 h-4 inline" /> View
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Verify Customer">
         <div className="space-y-4">
            {selectedCustomer ? (
               <div className="text-sm text-slate-600 space-y-2">
                 <p><strong>Name:</strong> {selectedCustomer.name}</p>
                 <p><strong>Email:</strong> {selectedCustomer.email}</p>
                 <p><strong>Phone:</strong> {selectedCustomer.phone || 'N/A'}</p>
                 <p><strong>Location:</strong> {selectedCustomer.location || 'N/A'}</p>
                 <p><strong>Current Status:</strong> {selectedCustomer.status}</p>
                 
                 <div className="flex gap-2 pt-4">
                    <button onClick={() => handleAction(selectedCustomer.id, 'verify')} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition-colors">
                      Verify
                    </button>
                    <button onClick={() => handleAction(selectedCustomer.id, 'reject')} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition-colors">
                      Reject
                    </button>
                 </div>
               </div>
            ) : <p>Loading...</p>}
         </div>
      </Modal>
    </div>
  );
}
