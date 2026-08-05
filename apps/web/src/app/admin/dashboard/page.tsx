'use client';
import { RoleGuard } from '@/components/common/role-guard';
import { Card } from '@/components/common/card';
import { Modal } from '@/components/common/modal';
import { Users, Building2, ClipboardCheck, CalendarRange, ChevronRight, MoreVertical, Search, Bell, MessageSquare, Plus, FileText, CheckCircle2, Activity, MapPin } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function AdminProductModeration() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const loadProducts = () => {
      const stored = localStorage.getItem('wrectifai_products');
      if (stored) {
        setProducts(JSON.parse(stored));
      }
    };
    loadProducts();
    window.addEventListener('products-updated', loadProducts);
    return () => window.removeEventListener('products-updated', loadProducts);
  }, []);

  const handleStatusUpdate = (id: number, status: 'approved' | 'rejected') => {
    const updated = products.map(p => p.id === id ? { ...p, status } : p);
    setProducts(updated);
    localStorage.setItem('wrectifai_products', JSON.stringify(updated));
    window.dispatchEvent(new Event('products-updated'));
    // Notify Garage
    const storedNotifs = localStorage.getItem('wrectifai_notifications');
    const notifs = storedNotifs ? JSON.parse(storedNotifs) : [];
    notifs.unshift({ id: Date.now(), type: 'System', title: 'Product Moderated', desc: `Your product was ${status} by admin.`, time: 'Just now', read: false, icon: 'FileText', color: status === 'approved' ? 'text-green-500' : 'text-red-500', bg: status === 'approved' ? 'bg-green-50' : 'bg-red-50', audience: 'Garage' });
    localStorage.setItem('wrectifai_notifications', JSON.stringify(notifs));
    window.dispatchEvent(new Event('notifications-updated'));
  };

  const handleDelete = (id: number) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('wrectifai_products', JSON.stringify(updated));
    window.dispatchEvent(new Event('products-updated'));
    // Notify Garage
    const storedNotifs = localStorage.getItem('wrectifai_notifications');
    const notifs = storedNotifs ? JSON.parse(storedNotifs) : [];
    notifs.unshift({ id: Date.now(), type: 'System', title: 'Product Deleted', desc: 'Your product was deleted by admin.', time: 'Just now', read: false, icon: 'Trash2', color: 'text-red-500', bg: 'bg-red-50', audience: 'Garage' });
    localStorage.setItem('wrectifai_notifications', JSON.stringify(notifs));
    window.dispatchEvent(new Event('notifications-updated'));
  };

  return (
    <Card className="p-5 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-[#17307a]">Garage Products Moderation</h3>
      </div>
      {products.length === 0 ? (
         <p className="text-sm text-slate-500 py-4 text-center border border-dashed rounded-lg">No products submitted by garages.</p>
      ) : (
         <div className="divide-y divide-slate-100">
           {products.map((p, idx) => (
             <div key={idx} className="flex items-center justify-between py-3">
               <div>
                 <p className="text-sm font-bold text-slate-900 line-clamp-1">{p.name}</p>
                 <p className="text-xs text-slate-500">{p.category} • {p.price}</p>
                 <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${p.status === 'approved' ? 'bg-green-50 text-green-600' : p.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                   {p.status || 'pending'}
                 </span>
               </div>
               <div className="flex gap-2">
                 <button onClick={() => handleStatusUpdate(p.id, 'approved')} className="text-xs font-bold text-green-600 border border-green-200 bg-green-50 px-2 py-1 rounded hover:bg-green-100">Approve</button>
                 <button onClick={() => handleStatusUpdate(p.id, 'rejected')} className="text-xs font-bold text-orange-600 border border-orange-200 bg-orange-50 px-2 py-1 rounded hover:bg-orange-100">Reject</button>
                 <button onClick={() => handleDelete(p.id)} className="text-xs font-bold text-red-600 border border-red-200 bg-red-50 px-2 py-1 rounded hover:bg-red-100">Delete</button>
               </div>
             </div>
           ))}
         </div>
      )}
    </Card>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>({ totalCustomers: 0, registeredGarages: 0, pendingApprovals: 0, activeBookings: 0, quotesCount: 0, serviceRequestsCount: 0, completedJobsCount: 0, pendingGarageList: [], recentlyRegisteredGarages: [] });
  const [actionModal, setActionModal] = useState<{isOpen: boolean, id: string, action: string, type: 'confirm' | 'error', message: string}>({isOpen: false, id: '', action: '', type: 'confirm', message: ''});

  useEffect(() => {
    async function loadData() {
      try {
        const statsData = await apiClient.get<any>('/admin/stats').catch(() => ({ totalCustomers: 0, registeredGarages: 0, pendingApprovals: 0, activeBookings: 0, quotesCount: 0, completedJobsCount: 0, pendingGarageList: [], recentlyRegisteredGarages: [] }));
        setStats(statsData);
      } catch (err) {
        console.error('Failed to load admin data', err);
      }
    }
    loadData();
  }, []);

  const pendingGarages = stats.pendingGarageList || [];
  const recentGarages = stats.recentlyRegisteredGarages || [];

  const formatTime = (isoString: string) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleApprove = async (id: string) => {
    try {
      await apiClient.post(`/admin/onboarding/garages/${id}/approve`, {});
      const statsData = await apiClient.get<any>('/admin/stats').catch(() => stats);
      setStats(statsData);
      setActionModal({isOpen: false, id: '', action: '', type: 'confirm', message: ''});
      
      // Dispatch Notifications
      const notifs = JSON.parse(localStorage.getItem('wrectifai_notifications') || '[]');
      notifs.unshift({ id: Date.now(), type: 'System', title: 'Garage Approved', desc: `Your garage has been approved by admin.`, time: 'Just now', read: false, icon: 'CheckCircle2', color: 'text-green-500', bg: 'bg-green-50', audience: 'Garage' });
      localStorage.setItem('wrectifai_notifications', JSON.stringify(notifs));
      window.dispatchEvent(new Event('notifications-updated'));
    } catch (err) {
      setActionModal({isOpen: true, id: '', action: '', type: 'error', message: 'Failed to approve garage.'});
    }
  };

  const handleAction = async (id: string, action: string) => {
    try {
      await apiClient.post(`/admin/onboarding/garages/${id}/${action}`, {});
      const statsData = await apiClient.get<any>('/admin/stats').catch(() => stats);
      setStats(statsData);
      setActionModal({isOpen: false, id: '', action: '', type: 'confirm', message: ''});
      
      // Dispatch Notifications
      const notifs = JSON.parse(localStorage.getItem('wrectifai_notifications') || '[]');
      notifs.unshift({ id: Date.now(), type: 'System', title: `Garage ${action.charAt(0).toUpperCase() + action.slice(1)}`, desc: `Your garage has been ${action} by admin.`, time: 'Just now', read: false, icon: action === 'approve' ? 'CheckCircle2' : 'ShieldAlert', color: action === 'approve' ? 'text-green-500' : 'text-red-500', bg: action === 'approve' ? 'bg-green-50' : 'bg-red-50', audience: 'Garage' });
      localStorage.setItem('wrectifai_notifications', JSON.stringify(notifs));
      window.dispatchEvent(new Event('notifications-updated'));
    } catch (err) {
      setActionModal({isOpen: true, id: '', action: '', type: 'error', message: `Failed to ${action} garage.`});
    }
  };

  const confirmAction = () => {
    if (actionModal.action === 'approve') {
      handleApprove(actionModal.id);
    } else {
      handleAction(actionModal.id, actionModal.action);
    }
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="p-6 bg-slate-50 min-h-screen">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
        <div>
           <h1 className="text-2xl font-bold text-[#17307a] mb-1 flex items-center gap-2">Welcome back, Admin!</h1>
           <p className="text-sm text-slate-500">Here's what's happening on WrectifAI today.</p>
        </div>
        <div className="flex gap-4">
           <Link href="/admin/garages/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 hover:bg-blue-700 transition-colors"><Plus className="w-4 h-4"/> Register Garage</Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Link href="/admin/users" className="block">
          <Card className="p-5 flex items-center gap-4 h-full hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><Users className="w-6 h-6"/></div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-0.5">Total Customers</p>
              <p className="text-2xl font-black text-[#17307a]">{stats.totalCustomers}</p>
              <p className="text-[10px] font-bold text-green-500 flex items-center gap-1">↑ Active</p>
            </div>
          </Card>
        </Link>
        <Link href="/admin/garages" className="block">
          <Card className="p-5 flex items-center gap-4 h-full hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center"><Building2 className="w-6 h-6"/></div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-0.5">Registered Garages</p>
              <p className="text-2xl font-black text-[#17307a]">{stats.registeredGarages}</p>
              <p className="text-[10px] font-bold text-green-500 flex items-center gap-1">↑ Active</p>
            </div>
          </Card>
        </Link>
        <Link href="/admin/garages/pending-approvals" className="block">
          <Card className="p-5 flex items-center gap-4 border-orange-200 h-full hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center"><ClipboardCheck className="w-6 h-6"/></div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-0.5">Pending Approvals</p>
              <p className="text-2xl font-black text-[#17307a]">{stats.pendingApprovals}</p>
              {stats.pendingApprovals > 0 ? (
                <p className="text-[10px] font-bold text-orange-500">Action Required</p>
              ) : (
                <p className="text-[10px] font-bold text-green-500">All caught up</p>
              )}
            </div>
          </Card>
        </Link>
        <Link href="/admin/bookings" className="block">
          <Card className="p-5 flex items-center gap-4 h-full hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center"><CalendarRange className="w-6 h-6"/></div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-0.5">Active Bookings</p>
              <p className="text-2xl font-black text-[#17307a]">{stats.activeBookings}</p>
              <p className="text-[10px] font-bold text-green-500 flex items-center gap-1">Live</p>
            </div>
          </Card>
        </Link>
        <Link href="/admin/quotes" className="block">
          <Card className="p-5 flex items-center gap-4 h-full hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><FileText className="w-6 h-6"/></div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-0.5">Quotes</p>
              <p className="text-2xl font-black text-[#17307a]">{stats.quotesCount}</p>
              <p className="text-[10px] font-bold text-green-500 flex items-center gap-1">Submitted</p>
            </div>
          </Card>
        </Link>
        <Link href="/admin/service-requests?filter=completed" className="block">
          <Card className="p-5 flex items-center gap-4 h-full hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center"><CheckCircle2 className="w-6 h-6"/></div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-0.5">Completed Jobs</p>
              <p className="text-2xl font-black text-[#17307a]">{stats.completedJobsCount}</p>
              <p className="text-[10px] font-bold text-green-500 flex items-center gap-1">Finished</p>
            </div>
          </Card>
        </Link>
      </div>

      <div className="flex flex-col gap-6 mb-6">
        <div className="flex-1 w-full max-w-full">
           <Card className="p-5 mb-6">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[#17307a]">Pending Garage Approvals</h3>
                <Link href="/admin/garages/pending-approvals" className="text-xs text-blue-600 font-bold">View All</Link>
             </div>
             <div className="flex gap-4 overflow-x-auto pb-2">
                {stats.pendingApprovals === 0 && pendingGarages.length === 0 ? (
                  <p className="text-sm text-slate-500 p-4">No pending garage approvals at the moment.</p>
                ) : (
                  pendingGarages.map((g: any, idx: number) => (
                    <div key={g.id} className="min-w-[280px] border rounded-xl p-4 bg-white relative">
                      {idx === 0 && <div className="absolute top-0 right-0 bg-orange-100 text-orange-600 text-[9px] font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-xl">NEW</div>}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100"></div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 leading-tight">{g.name}</p>
                          <p className="text-[10px] text-slate-500">Owner: {g.ownerName || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="space-y-1 mb-4">
                        <p className="text-[10px] text-slate-600 flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {g.city || 'N/A'}</p>
                        <p className="text-[10px] text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Documents Under Review</p>
                      </div>
                      <p className="text-[9px] text-slate-400 mb-3">Submitted: {formatTime(g.createdAt)}</p>
                      <div className="grid grid-cols-3 gap-2">
                         <Link href={`/admin/garages`} className="border border-slate-200 text-blue-600 rounded text-[10px] font-bold py-1.5 hover:bg-slate-50 text-center flex items-center justify-center">View</Link>
                         <button onClick={() => setActionModal({isOpen: true, id: g.id, action: 'approve', type: 'confirm', message: `Are you sure you want to approve ${g.name}?`})} className="bg-green-50 text-green-600 rounded text-[10px] font-bold py-1.5 hover:bg-green-100">Approve</button>
                         <button onClick={() => setActionModal({isOpen: true, id: g.id, action: 'reject', type: 'confirm', message: `Are you sure you want to reject ${g.name}?`})} className="bg-red-50 text-red-600 rounded text-[10px] font-bold py-1.5 hover:bg-red-100 text-center">Reject</button>
                      </div>
                    </div>
                  ))
                )}
             </div>
           </Card>
           
           <AdminProductModeration />

         </div>
         <div className="w-96 max-w-[384px] shrink-0">
             <Card className="p-5 col-span-1">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-[#17307a]">Recent Activity</h3>
                 </div>
               <div className="space-y-4 pl-4 relative before:absolute before:inset-0 before:ml-1 before:h-full before:w-px before:bg-slate-100">
                 {recentGarages.length === 0 ? (
                   <p className="text-xs text-slate-500">No recent activity</p>
                 ) : (
                   recentGarages.slice(0, 3).map((g: any) => (
                     <div key={g.id} className="relative">
                        <div className="absolute -left-5 top-1 w-2 h-2 rounded-full bg-blue-500"></div>
                        <p className="text-xs font-bold text-slate-800">New Garage Registered</p>
                        <p className="text-[10px] text-slate-500">{g.name} joined the platform</p>
                     </div>
                   ))
                 )}
               </div>
             </Card>

             <Card className="p-5 col-span-2 flex gap-6">
                <div className="flex-1">
                   <div className="flex justify-between items-center mb-4">
                     <h3 className="font-bold text-[#17307a]">Pending Tasks</h3>
                   </div>
                   <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 border border-slate-100">
                         <div className="flex items-center gap-3"><div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center"><Building2 className="w-4 h-4"/></div><p className="text-xs font-bold text-slate-700">Pending Garage Approvals</p></div>
                         <span className="text-xs font-bold text-red-500">{stats.pendingApprovals}</span>
                      </div>
                   </div>
                </div>
                <div className="flex-1">
                   <h3 className="font-bold text-[#17307a] mb-4">Platform Overview</h3>
                   <div className="grid grid-cols-2 gap-3">
                      <div className="border rounded-lg p-3 bg-white">
                         <div className="flex items-center gap-2 mb-2"><CalendarRange className="w-4 h-4 text-blue-500"/><p className="text-[10px] font-bold text-slate-500">Total Bookings</p></div>
                         <p className="text-xl font-bold text-slate-800">{stats.activeBookings}</p>
                      </div>
                      <div className="border rounded-lg p-3 bg-white">
                         <div className="flex items-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4 text-green-500"/><p className="text-[10px] font-bold text-slate-500">Garages</p></div>
                         <p className="text-xl font-bold text-slate-800">{stats.registeredGarages}</p>
                      </div>
                   </div>
                </div>
             </Card>
           </div>
      </div>
      
      <Card className="p-0 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
           <h3 className="font-bold text-[#17307a]">Recently Registered Garages</h3>
           <Link href="/admin/garages" className="text-xs text-blue-600 font-bold">View All</Link>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="p-4 text-[11px] font-bold text-slate-500">Garage Name</th>
              <th className="p-4 text-[11px] font-bold text-slate-500">Owner</th>
              <th className="p-4 text-[11px] font-bold text-slate-500">City</th>
              <th className="p-4 text-[11px] font-bold text-slate-500">Registration Date</th>
              <th className="p-4 text-[11px] font-bold text-slate-500">Status</th>
              <th className="p-4 text-[11px] font-bold text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {recentGarages.length === 0 ? (
               <tr>
                 <td colSpan={6} className="p-8 text-center text-slate-500 text-sm">No garages registered yet.</td>
               </tr>
            ) : (
               recentGarages.map((g: any) => (
                 <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                   <td className="p-4">
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded bg-slate-100"></div>
                       <span className="font-bold text-sm text-[#17307a]">{g.name}</span>
                     </div>
                   </td>
                   <td className="p-4 text-sm text-slate-600">{g.ownerName || 'N/A'}</td>
                   <td className="p-4 text-sm text-slate-600">{g.city || 'N/A'}</td>
                   <td className="p-4 text-sm text-slate-500">{formatTime(g.createdAt)}</td>
                   <td className="p-4">
                     <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                       g.approvalStatus === 'approved' ? 'bg-green-100 text-green-700' :
                       g.approvalStatus === 'pending' ? 'bg-orange-100 text-orange-700' :
                       'bg-red-100 text-red-700'
                     }`}>
                       {g.approvalStatus ? g.approvalStatus.charAt(0).toUpperCase() + g.approvalStatus.slice(1) : 'Unknown'}
                     </span>
                   </td>
                   <td className="p-4">
<div className="flex gap-2">
  {g.approvalStatus === 'pending' && (
    <>
      <button onClick={() => setActionModal({isOpen: true, id: g.id, action: 'approve', type: 'confirm', message: `Are you sure you want to approve ${g.name}?`})} className="text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded hover:bg-green-100 font-bold">Approve</button>
      <button onClick={() => setActionModal({isOpen: true, id: g.id, action: 'reject', type: 'confirm', message: `Are you sure you want to reject ${g.name}?`})} className="text-[10px] bg-red-50 text-red-700 px-2 py-1 rounded hover:bg-red-100 font-bold">Reject</button>
    </>
  )}
  {g.approvalStatus === 'approved' && (
    <button onClick={() => setActionModal({isOpen: true, id: g.id, action: 'suspend', type: 'confirm', message: `Are you sure you want to suspend ${g.name}?`})} className="text-[10px] bg-orange-50 text-orange-700 px-2 py-1 rounded hover:bg-orange-100 font-bold">Suspend</button>
  )}
</div>
</td>
                 </tr>
               ))
            )}
          </tbody>
        </table>
      </Card>

      <Modal isOpen={actionModal.isOpen} onClose={() => setActionModal({isOpen: false, id: '', action: '', type: 'confirm', message: ''})} title={actionModal.type === 'error' ? 'Error' : 'Confirm Action'}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">{actionModal.message}</p>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button onClick={() => setActionModal({isOpen: false, id: '', action: '', type: 'confirm', message: ''})} className="px-4 py-2 border rounded-lg text-sm font-bold hover:bg-slate-50">
              {actionModal.type === 'error' ? 'Close' : 'Cancel'}
            </button>
            {actionModal.type === 'confirm' && (
              <button onClick={confirmAction} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">
                Confirm
              </button>
            )}
          </div>
        </div>
      </Modal>

    </div>
    </RoleGuard>
  );
}
