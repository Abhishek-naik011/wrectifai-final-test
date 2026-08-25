
'use client';
import { Card } from '@/components/common/card';
import { Search, Filter, Download, Plus, MoreVertical, Eye, Edit2, PauseCircle, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/common/modal';

export default function AllGaragesPage() {
  const router = useRouter();
  const [garages, setGarages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGarage, setSelectedGarage] = useState<any>(null);
  const [editingGarage, setEditingGarage] = useState<any>(null);
  const [deletingGarage, setDeletingGarage] = useState<any>(null);
  const [deleteStats, setDeleteStats] = useState<{activeBookings: number, pendingBookings: number, activeCustomers: number} | null>(null);
  const [deleteStatsError, setDeleteStatsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [approvalModal, setApprovalModal] = useState<{isOpen: boolean, id: string, action: string}>({isOpen: false, id: '', action: ''});
  const [verificationModal, setVerificationModal] = useState<{isOpen: boolean, id: string, action: string}>({isOpen: false, id: '', action: ''});
  const [statusModal, setStatusModal] = useState<{isOpen: boolean, id: string, action: string}>({isOpen: false, id: '', action: ''});

  const loadData = async () => {
    setLoading(true);
    try {
      const garagesData = await apiClient.get<any[]>('/admin/onboarding/garages');
      setGarages(garagesData);
    } catch (err) {
      console.error('Failed to load garages', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id: string, action: string) => {
    try {
      await apiClient.post(`/admin/onboarding/garages/${id}/${action}`);
      await loadData();
      if (selectedGarage && selectedGarage.id === id) {
        setSelectedGarage((prev: any) => ({ ...prev, approvalStatus: action === 'approve' ? 'approved' : 'rejected' }));
      }
      setApprovalModal({isOpen: false, id: '', action: ''});
    } catch (err) {
      console.error('Failed to update approval', err);
    }
  };

  const handleVerify = async (id: string, action: string) => {
    try {
      await apiClient.post(`/admin/onboarding/garages/${id}/verify-status`, { action });
      await loadData();
      if (selectedGarage && selectedGarage.id === id) {
        setSelectedGarage((prev: any) => ({ ...prev, verificationStatus: action === 'verify' ? 'verified' : 'rejected' }));
      }
      setVerificationModal({isOpen: false, id: '', action: ''});
    } catch (err) {
      console.error('Failed to verify garage', err);
    }
  };

  const handleStatus = async (id: string, action: string) => {
    try {
      await apiClient.post(`/admin/onboarding/garages/${id}/status`, { status: action });
      await loadData();
      if (selectedGarage && selectedGarage.id === id) {
        setSelectedGarage((prev: any) => ({ ...prev, status: action }));
      }
      setStatusModal({isOpen: false, id: '', action: ''});
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const submitEdit = async () => {
    setIsSubmitting(true);
    try {
      await apiClient.put(`/admin/onboarding/garages/${editingGarage.id}`, {
        name: editingGarage.name,
        phone: editingGarage.phone,
        email: editingGarage.ownerEmail,
        address: editingGarage.address,
        city: editingGarage.city,
        state: editingGarage.state,
        pincode: editingGarage.pincode,
        ownerName: editingGarage.ownerName
      });
      setToastMessage({ type: 'success', text: 'Garage updated successfully!' });
      setTimeout(() => setToastMessage(null), 3000);
      setEditingGarage(null);
      await loadData();
    } catch (err) {
      setToastMessage({ type: 'error', text: 'Failed to update garage.' });
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async (garage: any) => {
    setDeletingGarage(garage);
    setDeleteStats(null);
    setDeleteStatsError(false);
    try {
      const stats = await apiClient.get<any>(`/admin/onboarding/garages/${garage.id}/related-data`);
      setDeleteStats(stats);
    } catch (err) {
      console.error(err);
      setDeleteStatsError(true);
    }
  };

  const submitDelete = async () => {
    setIsSubmitting(true);
    try {
      await apiClient.delete(`/admin/onboarding/garages/${deletingGarage.id}`);
      setToastMessage({ type: 'success', text: 'Garage deleted successfully!' });
      setTimeout(() => setToastMessage(null), 3000);
      setDeletingGarage(null);
      setDeleteStats(null);
      await loadData();
    } catch (err) {
      setToastMessage({ type: 'error', text: 'Failed to delete garage.' });
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalGarages = garages.length;
  const approvedGarages = garages.filter(g => g.approvalStatus === 'approved').length;
  const pendingApprovals = garages.filter(g => g.approvalStatus === 'pending').length;
  const suspendedGarages = garages.filter(g => g.approvalStatus === 'suspended').length;

  const formatTime = (isoString: string) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const filteredGarages = garages
    .filter(g => {
      if (!searchQuery) return true;
      const sq = searchQuery.toLowerCase();
      return (
        (g.name && g.name.toLowerCase().includes(sq)) ||
        (g.ownerName && g.ownerName.toLowerCase().includes(sq)) ||
        (g.ownerEmail && g.ownerEmail.toLowerCase().includes(sq)) ||
        (g.phone && g.phone.toLowerCase().includes(sq))
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold text-[#17307a] mb-1">All Garages</h1>
           <p className="text-sm text-slate-500">Dashboard &gt; Garage Management &gt; All Garages</p>
        </div>
        <Link href="/admin/garages/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 hover:bg-blue-700 transition-colors"><Plus className="w-4 h-4"/> Register Garage</Link>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-5 bg-white border border-blue-100 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><div className="text-xl font-bold">G</div></div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-0.5">Total Garages</p>
            <p className="text-2xl font-black text-[#17307a]">{loading ? '-' : totalGarages}</p>
          </div>
        </Card>
        <Card className="p-5 bg-white border border-green-100 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center"><CheckCircle2 className="w-6 h-6"/></div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-0.5">Approved Garages</p>
            <p className="text-2xl font-black text-[#17307a]">{loading ? '-' : approvedGarages}</p>
          </div>
        </Card>
        <Card className="p-5 bg-white border border-orange-100 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center"><Clock className="w-6 h-6"/></div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-0.5">Pending Approvals</p>
            <p className="text-2xl font-black text-[#17307a]">{loading ? '-' : pendingApprovals}</p>
          </div>
        </Card>
        <Card className="p-5 bg-white border border-purple-100 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center"><PauseCircle className="w-6 h-6"/></div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-0.5">Suspended Garages</p>
            <p className="text-2xl font-black text-[#17307a]">{loading ? '-' : suspendedGarages}</p>
          </div>
        </Card>
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
              <th className="p-4 text-xs font-bold text-slate-500">Status</th>
              <th className="p-4 text-xs font-bold text-slate-500">Joined Date</th>
              <th className="p-4 text-xs font-bold text-slate-500 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 text-sm">Loading garages...</td>
                </tr>
            ) : filteredGarages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 text-sm">{searchQuery ? 'No garages found matching your search.' : 'No garages registered yet.'}</td>
                </tr>
            ) : (
                filteredGarages.map(g => (
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
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      g.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' :
                      g.status === 'inactive' && g.approvalStatus === 'approved' && g.verificationStatus === 'verified' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                      g.approvalStatus === 'rejected' || g.verificationStatus === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                      g.verificationStatus === 'verified' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      g.approvalStatus === 'approved' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      'bg-orange-50 text-orange-600 border-orange-100'
                    }`}>
                        {g.status === 'active' ? 'Active' : 
                         g.status === 'inactive' && g.approvalStatus === 'approved' && g.verificationStatus === 'verified' ? 'Inactive' :
                         g.approvalStatus === 'rejected' || g.verificationStatus === 'rejected' ? 'Rejected' :
                         g.verificationStatus === 'verified' ? 'Verified' :
                         g.approvalStatus === 'approved' ? 'Approved' : 'Pending'}
                    </span>
                    </td>
                    <td className="p-4 text-xs text-slate-600">{formatTime(g.createdAt)}</td>
                    <td className="p-4">
                    <div className="flex gap-1.5 justify-center">
                        <button onClick={() => setSelectedGarage(g)} className="p-1.5 rounded-md hover:bg-blue-50 text-blue-500 border border-slate-200 bg-white" title="View"><Eye className="w-3.5 h-3.5"/></button>
                        <button onClick={() => setEditingGarage({...g})} className="p-1.5 rounded-md hover:bg-orange-50 text-orange-500 border border-slate-200 bg-white" title="Edit"><Edit2 className="w-3.5 h-3.5"/></button>
                        <button onClick={() => confirmDelete(g)} className="p-1.5 rounded-md hover:bg-red-50 text-red-500 border border-slate-200 bg-white" title="Delete"><Trash2 className="w-3.5 h-3.5"/></button>
                    </div>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </Card>

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
                <div className="space-y-3 mt-2 border border-slate-100 rounded-lg p-3 bg-slate-50">
                  <div className="flex justify-between items-center text-sm border-b pb-2">
                    <span className="text-slate-600 font-bold">Approval Status:</span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${selectedGarage.approvalStatus === 'approved' ? 'bg-green-50 text-green-600 border-green-100' : selectedGarage.approvalStatus === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                        {selectedGarage.approvalStatus || 'Pending'}
                      </span>
                      {selectedGarage.approvalStatus !== 'approved' && (
                        <div className="flex gap-1">
                          <button onClick={() => setApprovalModal({isOpen: true, id: selectedGarage.id, action: 'approve'})} className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[10px] font-bold hover:bg-green-200">Approve</button>
                          {selectedGarage.approvalStatus !== 'rejected' && <button onClick={() => setApprovalModal({isOpen: true, id: selectedGarage.id, action: 'reject'})} className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-[10px] font-bold hover:bg-red-200">Reject</button>}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b pb-2">
                    <span className="text-slate-600 font-bold">Verification:</span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${selectedGarage.verificationStatus === 'verified' ? 'bg-green-50 text-green-600 border-green-100' : selectedGarage.verificationStatus === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {selectedGarage.verificationStatus || 'Pending Verification'}
                      </span>
                      {selectedGarage.approvalStatus === 'approved' && selectedGarage.verificationStatus !== 'verified' && (
                        <div className="flex gap-1">
                          <button onClick={() => setVerificationModal({isOpen: true, id: selectedGarage.id, action: 'verify'})} className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[10px] font-bold hover:bg-green-200">Verify</button>
                          {selectedGarage.verificationStatus !== 'rejected' && <button onClick={() => setVerificationModal({isOpen: true, id: selectedGarage.id, action: 'reject'})} className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-[10px] font-bold hover:bg-red-200">Reject</button>}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 font-bold">Status:</span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${selectedGarage.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {selectedGarage.status || 'Inactive'}
                      </span>
                      {selectedGarage.approvalStatus === 'approved' && selectedGarage.verificationStatus === 'verified' && (
                        <div className="flex gap-1">
                          {selectedGarage.status !== 'active' ? (
                            <button onClick={() => setStatusModal({isOpen: true, id: selectedGarage.id, action: 'active'})} className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[10px] font-bold hover:bg-green-200">Make Active</button>
                          ) : (
                            <button onClick={() => setStatusModal({isOpen: true, id: selectedGarage.id, action: 'inactive'})} className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-bold hover:bg-slate-300">Make Inactive</button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={verificationModal.isOpen} onClose={() => setVerificationModal({isOpen: false, id: '', action: ''})} title="Confirm Verification Action" className="max-w-md">
        <p className="text-sm text-slate-600 mb-6">Are you sure you want to {verificationModal.action} this garage?</p>
        <div className="flex justify-end gap-3">
           <button onClick={() => setVerificationModal({isOpen: false, id: '', action: ''})} className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
           <button onClick={() => handleVerify(verificationModal.id, verificationModal.action)} className={`px-4 py-2 text-sm font-bold text-white rounded-lg ${verificationModal.action === 'verify' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>Confirm</button>
        </div>
      </Modal>

      <Modal isOpen={approvalModal.isOpen} onClose={() => setApprovalModal({isOpen: false, id: '', action: ''})} title="Confirm Approval Action" className="max-w-md">
        <p className="text-sm text-slate-600 mb-6">Are you sure you want to {approvalModal.action} this garage?</p>
        <div className="flex justify-end gap-3">
           <button onClick={() => setApprovalModal({isOpen: false, id: '', action: ''})} className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
           <button onClick={() => handleApprove(approvalModal.id, approvalModal.action)} className={`px-4 py-2 text-sm font-bold text-white rounded-lg ${approvalModal.action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>Confirm</button>
        </div>
      </Modal>

      <Modal isOpen={statusModal.isOpen} onClose={() => setStatusModal({isOpen: false, id: '', action: ''})} title="Confirm Status Change" className="max-w-md">
        <p className="text-sm text-slate-600 mb-6">
          {statusModal.action === 'inactive' ? 
           "Are you sure you want to make this garage inactive? It may currently have customers or bookings. This could affect their services or appointments." : 
           "Are you sure you want to make this garage active?"}
        </p>
        <div className="flex justify-end gap-3">
           <button onClick={() => setStatusModal({isOpen: false, id: '', action: ''})} className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
           <button onClick={() => handleStatus(statusModal.id, statusModal.action)} className={`px-4 py-2 text-sm font-bold text-white rounded-lg ${statusModal.action === 'active' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>{statusModal.action === 'active' ? 'Confirm' : 'Confirm / Make Inactive'}</button>
        </div>
      </Modal>

      <Modal isOpen={!!editingGarage} onClose={() => setEditingGarage(null)} title="Edit Garage" className="max-w-3xl">
        {editingGarage && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Garage Name</label>
                <input type="text" className="w-full border rounded p-2 text-sm" value={editingGarage.name || ''} onChange={e => setEditingGarage({...editingGarage, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Owner Name</label>
                <input type="text" className="w-full border rounded p-2 text-sm" value={editingGarage.ownerName || ''} onChange={e => setEditingGarage({...editingGarage, ownerName: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Owner Email</label>
                <input type="email" className="w-full border rounded p-2 text-sm" value={editingGarage.ownerEmail || ''} onChange={e => setEditingGarage({...editingGarage, ownerEmail: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Phone</label>
                <input type="text" className="w-full border rounded p-2 text-sm" value={editingGarage.phone || ''} onChange={e => setEditingGarage({...editingGarage, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Address</label>
                <input type="text" className="w-full border rounded p-2 text-sm" value={editingGarage.address || ''} onChange={e => setEditingGarage({...editingGarage, address: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">City</label>
                <input type="text" className="w-full border rounded p-2 text-sm" value={editingGarage.city || ''} onChange={e => setEditingGarage({...editingGarage, city: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">State</label>
                <input type="text" className="w-full border rounded p-2 text-sm" value={editingGarage.state || ''} onChange={e => setEditingGarage({...editingGarage, state: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Pincode</label>
                <input type="text" className="w-full border rounded p-2 text-sm" value={editingGarage.pincode || ''} onChange={e => setEditingGarage({...editingGarage, pincode: e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setEditingGarage(null)} className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
              <button onClick={submitEdit} disabled={isSubmitting} className="px-4 py-2 text-sm font-bold text-white rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={!!deletingGarage} onClose={() => setDeletingGarage(null)} title="Delete Garage" className="max-w-md">
        {deletingGarage && (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg border ${deleteStatsError || (deleteStats && (deleteStats.activeBookings > 0 || deleteStats.pendingBookings > 0 || deleteStats.activeCustomers > 0)) ? 'bg-red-50 border-red-100' : deleteStats ? 'bg-green-50 border-green-100' : 'bg-slate-50 border-slate-100'}`}>
              
              {deleteStatsError ? (
                <p className="text-sm text-red-700 font-bold">Unable to check this garage's active data. Please try again.</p>
              ) : deleteStats ? (
                (deleteStats.activeBookings > 0 || deleteStats.activeCustomers > 0 || deleteStats.pendingBookings > 0) ? (
                  <>
                    <h3 className="text-red-800 font-bold mb-2">Warning: This garage has active activity</h3>
                    <ul className="text-sm text-red-700 font-medium list-none space-y-1 mb-4">
                      <li>Active Customers: {deleteStats.activeCustomers}</li>
                      <li>Active Bookings: {deleteStats.activeBookings}</li>
                      <li>Pending Bookings: {deleteStats.pendingBookings}</li>
                    </ul>
                    <p className="text-red-600 text-sm mb-4">Deleting this garage may affect active customers or bookings.</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-green-800 font-bold mb-2">This garage has no active customers or bookings.</h3>
                    <ul className="text-sm text-green-700 font-medium list-none space-y-1 mb-4">
                      <li>Active Customers: 0</li>
                      <li>Active Bookings: 0</li>
                      <li>Pending Bookings: 0</li>
                    </ul>
                    <p className="text-green-600 text-sm mb-4">This garage is clear to delete.</p>
                  </>
                )
              ) : (
                <p className="text-sm text-slate-500">Checking garage activity...</p>
              )}
            </div>
            {deleteStats && !deleteStatsError && <p className="text-sm text-slate-700 font-bold">Are you sure you want to delete this garage?</p>}
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setDeletingGarage(null)} className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
              <button onClick={submitDelete} disabled={isSubmitting || !deleteStats || deleteStatsError} className="px-4 py-2 text-sm font-bold text-white rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 flex items-center gap-2">
                <Trash2 className="w-4 h-4"/>
                {isSubmitting ? 'Deleting...' : 'Delete Garage'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {toastMessage && (
        <div className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-xl text-white font-bold z-50 flex items-center gap-3 transition-all transform translate-y-0 ${toastMessage.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toastMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5"/> : <Trash2 className="w-5 h-5"/>}
          {toastMessage.text}
        </div>
      )}
    </div>
  );
}
