
'use client';
import { Card } from '@/components/common/card';
import { Modal } from '@/components/common/modal';
import { Search, Store, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { apiClient } from '@/lib/api-client';

export default function SuspendedGaragesPage() {
  const [garages, setGarages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [allGarages, setAllGarages] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmRestoreId, setConfirmRestoreId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const data = await apiClient.get<any[]>('/admin/onboarding/garages');
      setAllGarages(data);
      setGarages(data.filter(g => g.approvalStatus === 'suspended'));
    } catch (err) {
      console.error('Failed to load suspended garages', err);
    } finally {
      setLoading(false);
    }
  };

  const restoreGarage = async (id: string) => {
    try {
      setIsSubmitting(true);
      await apiClient.post(`/admin/onboarding/garages/${id}/restore`, {});
      await loadData();
      setConfirmRestoreId(null);
    } catch (err) {
      console.error('Failed to restore garage', err);
    } finally {
      setIsSubmitting(false);
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

  const totalPages = Math.ceil(filteredGarages.length / itemsPerPage) || 1;
  
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredGarages.length, totalPages, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const paginatedGarages = filteredGarages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const pageButtons = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 'ellipsis', totalPages] as const;
    }
    if (currentPage >= totalPages - 2) {
      return [
        1,
        'ellipsis',
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ] as const;
    }
    return [1, 'ellipsis', currentPage, 'ellipsis-2', totalPages] as const;
  }, [currentPage, totalPages]);

  const startIndex = filteredGarages.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredGarages.length);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const isThisMonth = (dateString?: string) => {
    if (!dateString) return false;
    const d = new Date(dateString);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  };

  const suspendedThisMonth = garages.filter(g => isThisMonth(g.updatedAt)).length;
  // Proxy for restored this month using recently approved updates
  const restoredThisMonth = allGarages.filter(g => g.approvalStatus === 'approved' && isThisMonth(g.updatedAt)).length;

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
            <h3 className="text-2xl font-bold text-slate-800">{loading ? '-' : suspendedThisMonth}</h3>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div>
            <p className="text-sm text-slate-500 font-medium">Restored This Month</p>
            <h3 className="text-2xl font-bold text-slate-800">{loading ? '-' : restoredThisMonth}</h3>
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
                <th className="p-4 font-semibold w-1/4">Garage Name</th>
                <th className="p-4 font-semibold w-1/4">Location</th>
                <th className="p-4 font-semibold w-1/4 text-right">Joined On</th>
                <th className="p-4 font-semibold w-1/4 text-right">Actions</th>
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
                paginatedGarages.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-sm font-semibold text-slate-900">{g.name}</td>
                    <td className="p-4 text-sm text-slate-700">{g.city || 'N/A'}</td>
                    <td className="p-4 text-sm text-right text-slate-700">{g.createdAt ? new Date(g.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setConfirmRestoreId(g.id)}
                        disabled={isSubmitting}
                        className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors disabled:opacity-50">
                        Restore
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center bg-white rounded-b-xl">
          <div className="hidden lg:block" />
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((current) => Math.max(1, current - 1))}
              disabled={currentPage === 1}
              className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#dbe6ff] bg-white text-[#17307a] shadow-[0_8px_20px_rgba(30,58,138,0.04)] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {pageButtons.map((entry, index) =>
              entry === 'ellipsis' || entry === 'ellipsis-2' ? (
                <div
                  key={`${entry}-${index}`}
                  className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#dbe6ff] bg-white text-[12px] font-semibold text-[#6173a1]"
                >
                  ...
                </div>
              ) : (
                <button
                  key={entry}
                  type="button"
                  onClick={() => setCurrentPage(entry as number)}
                  className={`flex h-10 w-10 items-center justify-center rounded-[12px] border text-[12px] font-semibold ${
                    entry === currentPage
                      ? 'border-[#1a56db] bg-[#1a56db] text-white shadow-[0_10px_20px_rgba(26,86,219,0.18)]'
                      : 'border-[#dbe6ff] bg-white text-[#6173a1]'
                  }`}
                >
                  {entry}
                </button>
              )
            )}
            <button
              type="button"
              onClick={() => setCurrentPage((current) => Math.min(totalPages, current + 1))}
              disabled={currentPage === totalPages}
              className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#dbe6ff] bg-white text-[#17307a] shadow-[0_8px_20px_rgba(30,58,138,0.04)] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="text-center text-[12.5px] font-medium text-[#4f67a2] lg:text-right">
            Showing {startIndex} - {endIndex} of {filteredGarages.length} suspended garages
          </div>
        </div>
      </Card>

      <Modal isOpen={!!confirmRestoreId} onClose={() => setConfirmRestoreId(null)} title="Restore Garage?" className="max-w-md">
        <div className="space-y-4">
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-900 font-medium leading-relaxed">
              Are you sure you want to restore this garage? This garage will be removed from Suspended Garages and restored to the appropriate garage listing.
            </p>
          </div>
          <p className="text-xs text-slate-500">Please confirm if you want to proceed with this status change.</p>
          <div className="flex justify-end gap-3 pt-2">
            <button 
              onClick={() => setConfirmRestoreId(null)} 
              className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
              Cancel
            </button>
            <button 
              onClick={() => confirmRestoreId && restoreGarage(confirmRestoreId)} 
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-bold text-white rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50">
              Restore Garage
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
