
'use client';
import { Card } from '@/components/common/card';
import { Search, MapPin, Download, CheckCircle2, XCircle, FileText, ChevronRight, ChevronLeft, Eye, Check, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/common/modal';

export default function PendingApprovalsPage() {
  const router = useRouter();
  const [garages, setGarages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGarage, setSelectedGarage] = useState<any>(null);
  const [actionModal, setActionModal] = useState<{isOpen: boolean, id: string, action: 'approve' | 'reject', message: string}>({isOpen: false, id: '', action: 'approve', message: ''});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGarages = garages.filter(g => {
    if (!searchQuery) return true;
    const sq = searchQuery.toLowerCase();
    return (
      (g.name && g.name.toLowerCase().includes(sq)) ||
      (g.ownerName && g.ownerName.toLowerCase().includes(sq)) ||
      (g.ownerEmail && g.ownerEmail.toLowerCase().includes(sq))
    );
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

  useEffect(() => {
    async function loadData() {
      try {
        const garagesData = await apiClient.get<any[]>('/admin/onboarding/garages');
        if (garagesData && Array.isArray(garagesData)) {
          // Filter pending garages
          setGarages(garagesData.filter(g => !g.approvalStatus || g.approvalStatus === 'pending'));
        }
      } catch (err) {
        console.error('Failed to load garages', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await apiClient.post(`/admin/onboarding/garages/${id}/approve`, {});
      setGarages(garages.filter(g => g.id !== id));
    } catch (err) {
      console.error('Failed to approve garage', err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await apiClient.post(`/admin/onboarding/garages/${id}/reject`, {});
      setGarages(garages.filter(g => g.id !== id));
    } catch (err) {
      console.error('Failed to reject garage', err);
    }
  };

  const confirmAction = () => {
    if (actionModal.action === 'approve') {
      handleApprove(actionModal.id);
    } else if (actionModal.action === 'reject') {
      handleReject(actionModal.id);
    }
    setActionModal({isOpen: false, id: '', action: 'approve', message: ''});
  };

  const formatTime = (isoString: string) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
  };

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

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold text-[#17307a] mb-1">Pending Approvals</h1>
           <p className="text-sm text-slate-500">Dashboard &gt; Garages &gt; Pending Approvals</p>
        </div>
      </div>

      <Card className="p-0 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
           <div className="relative w-80">
             <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
             <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by garage name, owner, email or phone..." className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm bg-white outline-none focus:ring-1 focus:ring-blue-500" />
           </div>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="p-4 text-xs font-bold text-slate-500">Garage Name</th>
              <th className="p-4 text-xs font-bold text-slate-500">Owner</th>
              <th className="p-4 text-xs font-bold text-slate-500">City</th>
              <th className="p-4 text-xs font-bold text-slate-500">Verification Status</th>
              <th className="p-4 text-xs font-bold text-slate-500">Submitted Date</th>
              <th className="p-4 text-xs font-bold text-slate-500 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 text-sm">Loading pending approvals...</td>
                </tr>
            ) : paginatedGarages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 text-sm">No pending garage approvals at the moment.</td>
                </tr>
            ) : (
                paginatedGarages.map(g => (
                <tr key={g.id} className="hover:bg-slate-50 bg-white transition-colors">
                    <td className="p-4">
                    <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 rounded-full border border-slate-100 bg-white flex items-center justify-center p-1 overflow-hidden flex-shrink-0 text-[10px] text-center font-bold text-blue-600">
                            {g.name ? g.name.substring(0, 2).toUpperCase() : 'G'}
                        </div>
                        <div>
                        <p className="text-sm font-bold text-[#17307a] leading-tight">{g.name}</p>
                        </div>
                    </div>
                    </td>
                    <td className="p-4">
                        <p className="text-xs font-bold text-[#17307a] leading-tight">{g.ownerName || 'N/A'}</p>
                    </td>
                    <td className="p-4 text-xs text-slate-600">{g.city || 'N/A'}</td>
                    <td className="p-4">
                      {g.verificationStatus === 'verified' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold border bg-green-50 text-green-600 border-green-100 uppercase">Verified</span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold border bg-orange-50 text-orange-600 border-orange-100 uppercase">Pending</span>
                      )}
                    </td>
                    <td className="p-4 text-xs text-slate-600">{formatTime(g.createdAt)}</td>
                    <td className="p-4">
                    <div className="flex gap-1.5 justify-center">
                        <button onClick={() => setSelectedGarage(g)} className="p-1.5 rounded-md hover:bg-blue-50 text-blue-500 border border-slate-200 bg-white transition-colors" title="View">
                          <Eye className="w-3.5 h-3.5"/>
                        </button>
                        <button onClick={() => setActionModal({isOpen: true, id: g.id, action: 'approve', message: `Are you sure you want to approve ${g.name}?`})} className="p-1.5 rounded-md hover:bg-green-50 text-green-600 border border-slate-200 bg-white transition-colors" title="Approve">
                          <Check className="w-3.5 h-3.5"/>
                        </button>
                        <button onClick={() => setActionModal({isOpen: true, id: g.id, action: 'reject', message: `Are you sure you want to reject ${g.name}?`})} className="p-1.5 rounded-md hover:bg-red-50 text-red-500 border border-slate-200 bg-white transition-colors" title="Reject">
                          <X className="w-3.5 h-3.5"/>
                        </button>
                    </div>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
        
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
            Showing {startIndex} - {endIndex} of {filteredGarages.length} garages
          </div>
        </div>
      </Card>
      {/* Garage Details Modal */}
      <Modal isOpen={!!selectedGarage} onClose={() => setSelectedGarage(null)} title="Garage Details" className="max-w-2xl">
        {selectedGarage && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 font-bold mb-1">Garage Name</p>
                <p className="text-sm font-semibold text-slate-900">{selectedGarage.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold mb-1">Garage ID</p>
                <p className="text-xs font-mono text-slate-700 bg-slate-100 p-1 rounded inline-block">{selectedGarage.id}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold mb-1">Owner Name</p>
                <p className="text-sm font-semibold text-slate-900">{selectedGarage.ownerName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold mb-1">Owner Email</p>
                <p className="text-sm font-semibold text-slate-900">{selectedGarage.ownerEmail || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold mb-1">Phone</p>
                <p className="text-sm font-semibold text-slate-900">{selectedGarage.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold mb-1">Address</p>
                <p className="text-sm font-semibold text-slate-900">{selectedGarage.address || 'N/A'}, {selectedGarage.city || 'N/A'}</p>
              </div>
            </div>
            
            <div>
              <p className="text-xs text-slate-500 font-bold mb-1">Description</p>
              <p className="text-sm text-slate-700">{selectedGarage.description || 'No description provided.'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 font-bold mb-1">Services Offered</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedGarage.services && selectedGarage.services.length > 0 ? (
                    selectedGarage.services.map((s: any, idx: number) => (
                      <span key={idx} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded font-medium border border-blue-100">
                        {s.name || s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">Not specified</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold mb-1">Status Information</p>
                <div className="space-y-3 mt-2 border border-slate-100 rounded-lg p-3.5 bg-slate-50">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-700 font-bold text-xs">Approval Status:</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      selectedGarage.approvalStatus === 'approved' 
                        ? 'bg-green-50 text-green-600 border-green-200' 
                        : selectedGarage.approvalStatus === 'rejected'
                        ? 'bg-red-50 text-red-600 border-red-200'
                        : 'bg-orange-50 text-orange-600 border-orange-200'
                    }`}>
                      {selectedGarage.approvalStatus || 'Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-700 font-bold text-xs">Verification:</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      selectedGarage.approvalStatus !== 'approved'
                        ? 'bg-slate-100 text-slate-400 border-slate-200'
                        : selectedGarage.verificationStatus === 'verified' 
                        ? 'bg-green-50 text-green-600 border-green-200' 
                        : selectedGarage.verificationStatus === 'rejected' 
                        ? 'bg-red-50 text-red-600 border-red-200' 
                        : 'bg-orange-50 text-orange-600 border-orange-200'
                    }`}>
                      {selectedGarage.approvalStatus !== 'approved' 
                        ? 'Locked' 
                        : (selectedGarage.verificationStatus || 'Pending Verification')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-700 font-bold text-xs">Status:</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      selectedGarage.approvalStatus !== 'approved' || selectedGarage.verificationStatus !== 'verified'
                        ? 'bg-slate-100 text-slate-400 border-slate-200'
                        : selectedGarage.status === 'active' 
                        ? 'bg-green-50 text-green-600 border-green-200' 
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {selectedGarage.approvalStatus !== 'approved' || selectedGarage.verificationStatus !== 'verified'
                        ? 'Inactive (Locked)' 
                        : (selectedGarage.status === 'active' ? 'Active' : 'Inactive')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
      <Modal isOpen={actionModal.isOpen} onClose={() => setActionModal({isOpen: false, id: '', action: 'approve', message: ''})} title="Confirm Action">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">{actionModal.message}</p>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button onClick={() => setActionModal({isOpen: false, id: '', action: 'approve', message: ''})} className="px-4 py-2 border rounded-lg text-sm font-bold hover:bg-slate-50">
              Cancel
            </button>
            <button onClick={confirmAction} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
