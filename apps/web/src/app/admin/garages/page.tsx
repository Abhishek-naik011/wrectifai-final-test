
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
  const [deleteStats, setDeleteStats] = useState<{bookings: number, customers: number} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    id: string;
    stage: 'approval' | 'verification' | 'status';
    action: string;
    title: string;
    warningMessage?: string;
  }>({
    isOpen: false,
    id: '',
    stage: 'approval',
    action: '',
    title: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const garagesData = await apiClient.get<any[]>('/admin/onboarding/garages');
      setGarages(garagesData);
      if (selectedGarage) {
        const updated = garagesData.find((g: any) => g.id === selectedGarage.id);
        if (updated) setSelectedGarage(updated);
      }
    } catch (err) {
      console.error('Failed to load garages', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStageAction = async (id: string, stage: 'approval' | 'verification' | 'status', action: string) => {
    try {
      setIsSubmitting(true);
      if (stage === 'verification') {
        await apiClient.post(`/admin/onboarding/garages/${id}/verify-status`, { action });
      } else {
        await apiClient.post(`/admin/onboarding/garages/${id}/${action}`, {});
      }
      
      const garagesData = await apiClient.get<any[]>('/admin/onboarding/garages');
      setGarages(garagesData);
      const updated = garagesData.find((g: any) => g.id === id);
      if (updated) {
        setSelectedGarage(updated);
      }
      
      setConfirmModal({ isOpen: false, id: '', stage: 'approval', action: '', title: '' });
      setToastMessage({ type: 'success', text: 'Status updated successfully!' });
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error('Failed to update status', err);
      setToastMessage({ type: 'error', text: 'Failed to update status.' });
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerAction = (id: string, stage: 'approval' | 'verification' | 'status', action: string) => {
    const isDestructive = action === 'reject' || action === 'deactivate';
    if (isDestructive) {
      setConfirmModal({
        isOpen: true,
        id,
        stage,
        action,
        title: action === 'reject' 
          ? `Reject Garage ${stage === 'approval' ? 'Approval' : 'Verification'}` 
          : 'Set Garage Inactive',
        warningMessage: 'Are you sure you want to make this change? This garage may currently have customers and bookings.',
      });
    } else {
      handleStageAction(id, stage, action);
    }
  };

  const getWorkflowBadge = (g: any) => {
    if (g.approvalStatus === 'rejected') {
      return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold border bg-red-50 text-red-600 border-red-100">Rejected</span>;
    }
    if (g.approvalStatus === 'suspended') {
      return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold border bg-purple-50 text-purple-600 border-purple-100">Suspended</span>;
    }
    if (!g.approvalStatus || g.approvalStatus === 'pending') {
      return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold border bg-orange-50 text-orange-600 border-orange-100">Pending Approval</span>;
    }
    // Approved
    if (g.verificationStatus === 'rejected') {
      return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold border bg-red-50 text-red-600 border-red-100">Verification Rejected</span>;
    }
    if (g.verificationStatus !== 'verified') {
      return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold border bg-blue-50 text-blue-600 border-blue-100">Approved</span>;
    }
    // Verified
    if (g.status === 'active') {
      return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold border bg-green-50 text-green-600 border-green-100">Active</span>;
    }
    return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold border bg-slate-100 text-slate-600 border-slate-200">Inactive</span>;
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
    try {
      const stats = await apiClient.get<any>(`/admin/onboarding/garages/${garage.id}/related-data`);
      setDeleteStats(stats);
    } catch (err) {
      console.error(err);
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
                      {getWorkflowBadge(g)}
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
                <div className="space-y-3 mt-2 border border-slate-100 rounded-lg p-3.5 bg-slate-50">
                  {/* Stage 1: Approval */}
                  <div className="space-y-2 pb-2.5 border-b border-slate-200">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-700 font-bold text-xs">1. Approval Status:</span>
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
                    {/* Action buttons for Stage 1 */}
                    <div className="flex gap-2">
                      {selectedGarage.approvalStatus !== 'approved' && (
                        <button
                          onClick={() => triggerAction(selectedGarage.id, 'approval', 'approve')}
                          disabled={isSubmitting}
                          className="flex-1 bg-green-600 text-white font-bold text-xs py-1.5 rounded shadow-sm hover:bg-green-700 transition-colors disabled:opacity-50">
                          Approve
                        </button>
                      )}
                      {selectedGarage.approvalStatus !== 'rejected' && (
                        <button
                          onClick={() => triggerAction(selectedGarage.id, 'approval', 'reject')}
                          disabled={isSubmitting}
                          className={`${selectedGarage.approvalStatus === 'approved' ? 'w-full' : 'flex-1'} bg-red-50 text-red-600 font-bold text-xs py-1.5 rounded border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50`}>
                          Reject
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Stage 2: Verification */}
                  <div className="space-y-2 pb-2.5 border-b border-slate-200">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-700 font-bold text-xs">2. Verification:</span>
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
                    {/* Action buttons for Stage 2 - available ONLY after Approval is completed */}
                    {selectedGarage.approvalStatus === 'approved' ? (
                      <div className="flex gap-2">
                        {selectedGarage.verificationStatus !== 'verified' && (
                          <button
                            onClick={() => triggerAction(selectedGarage.id, 'verification', 'verify')}
                            disabled={isSubmitting}
                            className="flex-1 bg-green-600 text-white font-bold text-xs py-1.5 rounded shadow-sm hover:bg-green-700 transition-colors disabled:opacity-50">
                            Verify
                          </button>
                        )}
                        {selectedGarage.verificationStatus !== 'rejected' && (
                          <button
                            onClick={() => triggerAction(selectedGarage.id, 'verification', 'reject')}
                            disabled={isSubmitting}
                            className={`${selectedGarage.verificationStatus === 'verified' ? 'w-full' : 'flex-1'} bg-red-50 text-red-600 font-bold text-xs py-1.5 rounded border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50`}>
                            Reject
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-400 italic">Complete Approval stage first to enable Verification.</p>
                    )}
                  </div>

                  {/* Stage 3: Active / Inactive */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-700 font-bold text-xs">3. Status:</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        selectedGarage.approvalStatus !== 'approved' || selectedGarage.verificationStatus !== 'verified'
                          ? 'bg-slate-100 text-slate-400 border-slate-200'
                          : selectedGarage.status === 'active' 
                          ? 'bg-green-50 text-green-600 border-green-200' 
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {selectedGarage.approvalStatus !== 'approved' || selectedGarage.verificationStatus !== 'verified'
                          ? 'Inactive (Locked)' 
                          : (selectedGarage.status || 'Inactive')}
                      </span>
                    </div>
                    {/* Action buttons for Stage 3 - available ONLY after Approval + Verification are completed */}
                    {selectedGarage.approvalStatus === 'approved' && selectedGarage.verificationStatus === 'verified' ? (
                      <div className="flex gap-2">
                        {selectedGarage.status !== 'active' ? (
                          <button
                            onClick={() => triggerAction(selectedGarage.id, 'status', 'activate')}
                            disabled={isSubmitting}
                            className="w-full bg-green-600 text-white font-bold text-xs py-1.5 rounded shadow-sm hover:bg-green-700 transition-colors disabled:opacity-50">
                            Set Active
                          </button>
                        ) : (
                          <button
                            onClick={() => triggerAction(selectedGarage.id, 'status', 'deactivate')}
                            disabled={isSubmitting}
                            className="w-full bg-orange-50 text-orange-600 font-bold text-xs py-1.5 rounded border border-orange-200 hover:bg-orange-100 transition-colors disabled:opacity-50">
                            Set Inactive
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-400 italic">Complete Approval and Verification to activate this garage.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={confirmModal.isOpen} onClose={() => setConfirmModal({isOpen: false, id: '', stage: 'approval', action: '', title: ''})} title={confirmModal.title} className="max-w-md">
        <div className="space-y-4">
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-900 font-medium leading-relaxed">
              {confirmModal.warningMessage || 'Are you sure you want to apply this action?'}
            </p>
          </div>
          <p className="text-xs text-slate-500">Please confirm if you want to proceed with this status change.</p>
          <div className="flex justify-end gap-3 pt-2">
            <button 
              onClick={() => setConfirmModal({isOpen: false, id: '', stage: 'approval', action: '', title: ''})} 
              className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
              Cancel
            </button>
            <button 
              onClick={() => handleStageAction(confirmModal.id, confirmModal.stage, confirmModal.action)} 
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-bold text-white rounded-lg bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50">
              Confirm
            </button>
          </div>
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
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <h3 className="text-red-800 font-bold mb-2">Warning: You are about to delete {deletingGarage.name}</h3>
              <p className="text-red-600 text-sm mb-4">Deleting this garage will affect its availability in the system. The record will be safely removed without destroying historical booking data.</p>
              
              {deleteStats ? (
                <ul className="text-sm text-red-700 font-medium list-disc list-inside">
                  <li>{deleteStats.bookings} bookings associated with this garage</li>
                  <li>{deleteStats.customers} unique customers associated</li>
                </ul>
              ) : (
                <p className="text-sm text-slate-500">Loading related data...</p>
              )}
            </div>
            <p className="text-sm text-slate-700 font-bold">Are you sure you want to delete this garage?</p>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setDeletingGarage(null)} className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
              <button onClick={submitDelete} disabled={isSubmitting || !deleteStats} className="px-4 py-2 text-sm font-bold text-white rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 flex items-center gap-2">
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
