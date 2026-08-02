
'use client';
import { Card } from '@/components/common/card';
import { Search, Store } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export default function SuspendedGaragesPage() {
  const [garages, setGarages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    try {
      const data = await apiClient.get<any[]>('/admin/onboarding/garages');
      setGarages(data.filter(g => g.approvalStatus === 'suspended'));
    } catch (err) {
      console.error('Failed to load suspended garages', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredGarages = garages.filter(g => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return g.name?.toLowerCase().includes(q) || g.city?.toLowerCase().includes(q);
  });

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
             <h1 className="text-2xl font-bold text-slate-900">Suspended Garages</h1>
             <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">{loading ? '-' : garages.length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-5 flex items-center gap-4">
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Suspended</p>
            <h3 className="text-2xl font-bold text-slate-800">{loading ? '-' : garages.length}</h3>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div>
            <p className="text-sm text-slate-500 font-medium">Suspended This Month</p>
            <h3 className="text-2xl font-bold text-slate-800">0</h3>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div>
            <p className="text-sm text-slate-500 font-medium">Restored This Month</p>
            <h3 className="text-2xl font-bold text-slate-800">0</h3>
          </div>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-200">
        <div className="p-4 border-b border-slate-100">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search suspended garages..." 
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
                <th className="p-4 font-semibold w-1/3">Garage Name</th>
                <th className="p-4 font-semibold w-1/3">Location</th>
                <th className="p-4 font-semibold w-1/3 text-right">Joined On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                 <tr><td colSpan={3} className="p-8 text-center text-sm text-slate-500">Loading...</td></tr>
              ) : filteredGarages.length === 0 ? (
                 <tr>
                    <td colSpan={3} className="p-12 text-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                         <Store className="w-8 h-8"/>
                      </div>
                      <p className="text-sm text-slate-500 font-medium">No Suspended Garages Found.</p>
                    </td>
                 </tr>
              ) : (
                filteredGarages.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-sm font-semibold text-slate-900">{g.name}</td>
                    <td className="p-4 text-sm text-slate-700">{g.city || 'N/A'}</td>
                    <td className="p-4 text-sm text-right text-slate-700">{g.createdAt ? new Date(g.createdAt).toLocaleDateString() : 'N/A'}</td>
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
