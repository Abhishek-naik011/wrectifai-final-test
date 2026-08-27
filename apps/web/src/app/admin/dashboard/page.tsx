'use client';
import { RoleGuard } from '@/components/common/role-guard';
import { Card } from '@/components/common/card';
import { Modal } from '@/components/common/modal';
import { Users, Building2, ClipboardCheck, CalendarRange, ChevronRight, MoreVertical, Search, Bell, MessageSquare, Plus, FileText, CheckCircle2, Activity, MapPin, Eye, Check, X } from 'lucide-react';
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
    <Card className="p-5 border border-slate-100 shadow-sm flex-1 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-[#17307a]">Garage Products Moderation</h3>
      </div>
      {products.length === 0 ? (
        <div className="flex-1 flex items-center justify-center border border-dashed rounded-lg py-4">
          <p className="text-sm text-slate-500 text-center">No products submitted by garages.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 flex-1 overflow-auto">
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
  const [actionModal, setActionModal] = useState<{ isOpen: boolean, id: string, action: string, type: 'confirm' | 'error', message: string }>({ isOpen: false, id: '', action: '', type: 'confirm', message: '' });
  const [selectedGarage, setSelectedGarage] = useState<any>(null);
  const [recentGaragesPage, setRecentGaragesPage] = useState(1);
  const [pendingGaragesPage, setPendingGaragesPage] = useState(1);
  const [fullPendingGarages, setFullPendingGarages] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const statsData = await apiClient.get<any>('/admin/stats').catch(() => ({ totalCustomers: 0, registeredGarages: 0, pendingApprovals: 0, activeBookings: 0, quotesCount: 0, serviceRequestsCount: 0, completedJobsCount: 0, pendingGarageList: [], recentlyRegisteredGarages: [] }));
        setStats(statsData);

        const garagesData = await apiClient.get<any[]>('/admin/onboarding/garages').catch(() => []);
        if (garagesData && Array.isArray(garagesData)) {
          setFullPendingGarages(garagesData.filter(g => !g.approvalStatus || g.approvalStatus === 'pending'));
        }
      } catch (err) {
        console.error('Failed to load admin data', err);
      }
    }
    loadData();
  }, []);

  const pendingGarages = fullPendingGarages.length > 0 ? fullPendingGarages : (stats.pendingGarageList || []);
  const recentGarages = stats.recentlyRegisteredGarages || [];

  const pendingGaragesPageSize = 5;
  const pendingGaragesTotalPages = Math.ceil(pendingGarages.length / pendingGaragesPageSize);
  const pendingGaragesPaginated = pendingGarages.slice((pendingGaragesPage - 1) * pendingGaragesPageSize, pendingGaragesPage * pendingGaragesPageSize);

  const formatTime = (isoString: string) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleApprove = async (id: string) => {
    try {
      await apiClient.post(`/admin/onboarding/garages/${id}/approve`, {});
      setFullPendingGarages(prev => prev.filter(g => g.id !== id));
      const statsData = await apiClient.get<any>('/admin/stats').catch(() => stats);
      setStats(statsData);
      setActionModal({ isOpen: false, id: '', action: '', type: 'confirm', message: '' });

      // Dispatch Notifications
      const notifs = JSON.parse(localStorage.getItem('wrectifai_notifications') || '[]');
      notifs.unshift({ id: Date.now(), type: 'System', title: 'Garage Approved', desc: `Your garage has been approved by admin.`, time: 'Just now', read: false, icon: 'CheckCircle2', color: 'text-green-500', bg: 'bg-green-50', audience: 'Garage' });
      localStorage.setItem('wrectifai_notifications', JSON.stringify(notifs));
      window.dispatchEvent(new Event('notifications-updated'));
    } catch (err) {
      setActionModal({ isOpen: true, id: '', action: '', type: 'error', message: 'Failed to approve garage.' });
    }
  };

  const handleAction = async (id: string, action: string) => {
    try {
      await apiClient.post(`/admin/onboarding/garages/${id}/${action}`, {});
      setFullPendingGarages(prev => prev.filter(g => g.id !== id));
      const statsData = await apiClient.get<any>('/admin/stats').catch(() => stats);
      setStats(statsData);
      setActionModal({ isOpen: false, id: '', action: '', type: 'confirm', message: '' });

      // Dispatch Notifications
      const notifs = JSON.parse(localStorage.getItem('wrectifai_notifications') || '[]');
      notifs.unshift({ id: Date.now(), type: 'System', title: `Garage ${action.charAt(0).toUpperCase() + action.slice(1)}`, desc: `Your garage has been ${action} by admin.`, time: 'Just now', read: false, icon: action === 'approve' ? 'CheckCircle2' : 'ShieldAlert', color: action === 'approve' ? 'text-green-500' : 'text-red-500', bg: action === 'approve' ? 'bg-green-50' : 'bg-red-50', audience: 'Garage' });
      localStorage.setItem('wrectifai_notifications', JSON.stringify(notifs));
      window.dispatchEvent(new Event('notifications-updated'));
    } catch (err) {
      setActionModal({ isOpen: true, id: '', action: '', type: 'error', message: `Failed to ${action} garage.` });
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
      <div className="space-y-6 pb-6">
        {/* Welcome Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-gradient-to-r from-blue-50 to-white">
          <div>
            <h1 className="text-2xl font-bold text-[#17307a] mb-1 flex items-center gap-2">Welcome back, Admin!</h1>
            <p className="text-sm text-slate-500">Here's what's happening on WrectifAI today.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href="/admin/garages/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" /> Register Garage
            </Link>
          </div>
        </div>

        {/* Top 6 KPI Metric Cards in a uniform responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Link href="/admin/users" className="block">
            <Card className="p-4 flex items-center gap-3.5 h-full hover:shadow-md transition-all border border-slate-100 hover:border-blue-200">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-500 truncate">Total Customers</p>
                <p className="text-xl font-black text-[#17307a]">{stats.totalCustomers}</p>
                <p className="text-[10px] font-bold text-green-500 flex items-center gap-1">↑ Active</p>
              </div>
            </Card>
          </Link>

          <Link href="/admin/garages" className="block">
            <Card className="p-4 flex items-center gap-3.5 h-full hover:shadow-md transition-all border border-slate-100 hover:border-green-200">
              <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-500 truncate">Registered Garages</p>
                <p className="text-xl font-black text-[#17307a]">{stats.registeredGarages}</p>
                <p className="text-[10px] font-bold text-green-500 flex items-center gap-1">↑ Active</p>
              </div>
            </Card>
          </Link>

          <Link href="/admin/garages/pending-approvals" className="block">
            <Card className="p-4 flex items-center gap-3.5 h-full hover:shadow-md transition-all border border-orange-200 hover:border-orange-300">
              <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-500 truncate">Pending Approvals</p>
                <p className="text-xl font-black text-[#17307a]">{stats.pendingApprovals}</p>
                {stats.pendingApprovals > 0 ? (
                  <p className="text-[10px] font-bold text-orange-500">Action Required</p>
                ) : (
                  <p className="text-[10px] font-bold text-green-500">All caught up</p>
                )}
              </div>
            </Card>
          </Link>

          <Link href="/admin/bookings" className="block">
            <Card className="p-4 flex items-center gap-3.5 h-full hover:shadow-md transition-all border border-slate-100 hover:border-purple-200">
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <CalendarRange className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-500 truncate">Active Bookings</p>
                <p className="text-xl font-black text-[#17307a]">{stats.activeBookings}</p>
                <p className="text-[10px] font-bold text-green-500 flex items-center gap-1">Live</p>
              </div>
            </Card>
          </Link>

          <Link href="/admin/quotes" className="block">
            <Card className="p-4 flex items-center gap-3.5 h-full hover:shadow-md transition-all border border-slate-100 hover:border-indigo-200">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-500 truncate">Quotes</p>
                <p className="text-xl font-black text-[#17307a]">{stats.quotesCount}</p>
                <p className="text-[10px] font-bold text-green-500 flex items-center gap-1">Submitted</p>
              </div>
            </Card>
          </Link>

          <Link href="/admin/service-requests?filter=completed" className="block">
            <Card className="p-4 flex items-center gap-3.5 h-full hover:shadow-md transition-all border border-slate-100 hover:border-teal-200">
              <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-500 truncate">Completed Jobs</p>
                <p className="text-xl font-black text-[#17307a]">{stats.completedJobsCount}</p>
                <p className="text-[10px] font-bold text-green-500 flex items-center gap-1">Finished</p>
              </div>
            </Card>
          </Link>
        </div>

        {/* 2-Column Responsive Main Grid: Left column (Approvals & Moderation), Right column (Activity & Tasks & Overview) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Pending Garage Approvals */}
            <Card className="p-5 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-[#17307a]">Pending Garage Approvals</h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                    {stats.pendingApprovals}
                  </span>
                </div>
                <Link href="/admin/garages/pending-approvals" className="text-xs text-blue-600 font-bold hover:underline">
                  View All &rarr;
                </Link>
              </div>

              {stats.pendingApprovals === 0 && pendingGarages.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center text-sm text-slate-500">
                  No pending garage approvals at the moment. All caught up!
                </div>
              ) : (
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse table-auto">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-2 py-3 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Garage Name</th>
                        <th className="px-2 py-3 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Owner</th>
                        <th className="px-2 py-3 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">City</th>
                        <th className="px-2 py-3 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-2 py-3 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Submitted</th>
                        <th className="px-2 py-3 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pendingGaragesPaginated.map((g: any, idx: number) => (
                        <tr key={g.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-2 py-3">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
                                {g.name ? g.name.substring(0, 2).toUpperCase() : 'GA'}
                              </div>
                              <div className="min-w-0">
                                <span className="text-xs sm:text-sm font-semibold text-slate-900 flex flex-wrap items-center gap-1.5 sm:gap-2">
                                  <span className="truncate max-w-[100px] sm:max-w-none">{g.name}</span>
                                  {idx === 0 && (
                                    <span className="bg-orange-500 text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs shrink-0">NEW</span>
                                  )}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-2 py-3 text-xs sm:text-sm text-slate-700 break-words">{g.ownerName || 'N/A'}</td>
                          <td className="px-2 py-3">
                            <div className="flex items-center gap-1 sm:gap-1.5 text-xs text-slate-600 break-words">
                              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
                              <span className="line-clamp-2">{g.city || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="px-2 py-3">
                            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-1.5 py-1 bg-green-50 text-green-600 rounded text-[10px] sm:text-xs font-medium max-w-[120px] sm:max-w-none whitespace-normal leading-tight">
                              <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" /> <span className="line-clamp-2">Under Review</span>
                            </span>
                          </td>
                          <td className="px-2 py-3 text-xs sm:text-sm text-slate-500">{formatTime(g.createdAt)}</td>
                          <td className="px-2 py-3 text-right whitespace-nowrap">
                            <div className="flex flex-nowrap justify-end gap-1.5 sm:gap-2">
                              <button onClick={() => setSelectedGarage(g)} className="p-1.5 rounded-md hover:bg-blue-50 text-blue-500 border border-slate-200 bg-white transition-colors shadow-sm shrink-0" title="View"><Eye className="w-3.5 h-3.5"/></button>
                              <button onClick={() => setActionModal({ isOpen: true, id: g.id, action: 'approve', type: 'confirm', message: `Are you sure you want to approve ${g.name}?` })} className="p-1.5 rounded-md hover:bg-green-50 text-green-600 border border-slate-200 bg-white transition-colors shadow-sm shrink-0" title="Approve"><Check className="w-3.5 h-3.5"/></button>
                              <button onClick={() => setActionModal({ isOpen: true, id: g.id, action: 'reject', type: 'confirm', message: `Are you sure you want to reject ${g.name}?` })} className="p-1.5 rounded-md hover:bg-red-50 text-red-500 border border-slate-200 bg-white transition-colors shadow-sm shrink-0" title="Reject"><X className="w-3.5 h-3.5"/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {pendingGaragesTotalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 px-4 py-3 bg-white gap-3">
                      <span className="text-xs font-medium text-slate-500">
                        Showing {(pendingGaragesPage - 1) * pendingGaragesPageSize + 1} to {Math.min(pendingGaragesPage * pendingGaragesPageSize, pendingGarages.length)} of {pendingGarages.length} entries
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setPendingGaragesPage(p => Math.max(1, p - 1))}
                          disabled={pendingGaragesPage === 1}
                          className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50 transition-colors shadow-sm"
                        >
                          Previous
                        </button>
                        <span className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg">
                          Page {pendingGaragesPage} of {pendingGaragesTotalPages}
                        </span>
                        <button
                          onClick={() => setPendingGaragesPage(p => Math.min(pendingGaragesTotalPages, p + 1))}
                          disabled={pendingGaragesPage === pendingGaragesTotalPages}
                          className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50 transition-colors shadow-sm"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Garage Products Moderation */}
            <AdminProductModeration />
          </div>

          {/* Right Column (4 cols) */}
          <div className="lg:col-span-4 flex flex-col">
            {/* Recent Activity */}
            <Card className="p-5 border border-slate-100 shadow-sm flex-1">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[#17307a] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span>Recent Activity</span>
                </h3>
              </div>
              <div className="space-y-4 pl-4 relative before:absolute before:inset-0 before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {recentGarages.length === 0 ? (
                  <p className="text-xs text-slate-500 py-2">No recent activity.</p>
                ) : (
                  recentGarages.slice(0, 6).map((g: any) => (
                    <div key={g.id} className="relative pl-3">
                      <div className="absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white"></div>
                      <p className="text-xs font-bold text-slate-800">New Garage Registered</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{g.name} joined the platform</p>
                      <span className="text-[9.5px] text-slate-400">{formatTime(g.createdAt)}</span>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Recently Registered Garages Full Width Table */}
        <Card className="p-0 overflow-hidden border border-slate-100 shadow-sm">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
            <div>
              <h3 className="font-bold text-[#17307a]">Recently Registered Garages</h3>
              <p className="text-xs text-slate-500 mt-0.5">Workshops that joined the platform recently</p>
            </div>
            <Link href="/admin/garages" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">
              View All Garages &rarr;
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Garage Name</th>
                  <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Owner</th>
                  <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">City</th>
                  <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Registration Date</th>
                  <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {recentGarages.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500 text-sm">No garages registered yet.</td>
                  </tr>
                ) : (
                  recentGarages.map((g: any) => (
                    <tr key={g.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                            {g.name ? g.name.substring(0, 2).toUpperCase() : 'GA'}
                          </div>
                          <span className="font-bold text-[#17307a]">{g.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600 font-medium">{g.ownerName || 'N/A'}</td>
                      <td className="p-4 text-slate-600">{g.city || 'N/A'}</td>
                      <td className="p-4 text-slate-500">{formatTime(g.createdAt)}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block ${g.approvalStatus === 'approved' ? 'bg-green-100 text-green-700' :
                            g.approvalStatus === 'pending' ? 'bg-orange-100 text-orange-700' :
                              'bg-red-100 text-red-700'
                          }`}>
                          {g.approvalStatus ? g.approvalStatus.charAt(0).toUpperCase() + g.approvalStatus.slice(1) : 'Pending'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {g.approvalStatus === 'pending' && (
                            <>
                              <button
                                type="button"
                                onClick={() => setActionModal({ isOpen: true, id: g.id, action: 'approve', type: 'confirm', message: `Are you sure you want to approve ${g.name}?` })}
                                className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded font-bold hover:bg-green-100 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => setActionModal({ isOpen: true, id: g.id, action: 'reject', type: 'confirm', message: `Are you sure you want to reject ${g.name}?` })}
                                className="text-xs bg-red-50 text-red-700 px-2.5 py-1 rounded font-bold hover:bg-red-100 transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {g.approvalStatus === 'approved' && (
                            <button
                              type="button"
                              onClick={() => setActionModal({ isOpen: true, id: g.id, action: 'suspend', type: 'confirm', message: `Are you sure you want to suspend ${g.name}?` })}
                              className="text-xs bg-orange-50 text-orange-700 px-2.5 py-1 rounded font-bold hover:bg-orange-100 transition-colors"
                            >
                              Suspend
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setSelectedGarage(g)}
                            className="p-1.5 rounded-md hover:bg-blue-50 text-blue-500 border border-slate-200 bg-white"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Modal isOpen={actionModal.isOpen} onClose={() => setActionModal({ isOpen: false, id: '', action: '', type: 'confirm', message: '' })} title={actionModal.type === 'error' ? 'Error' : 'Confirm Action'}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">{actionModal.message}</p>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button onClick={() => setActionModal({ isOpen: false, id: '', action: '', type: 'confirm', message: '' })} className="px-4 py-2 border rounded-lg text-sm font-bold hover:bg-slate-50">
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
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${selectedGarage.approvalStatus === 'approved'
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
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${selectedGarage.approvalStatus !== 'approved'
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
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${selectedGarage.approvalStatus !== 'approved' || selectedGarage.verificationStatus !== 'verified'
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
    </RoleGuard>
  );
}
