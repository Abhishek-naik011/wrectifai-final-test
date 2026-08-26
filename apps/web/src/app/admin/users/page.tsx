
'use client';
import { Card } from '@/components/common/card';
import { Search, UserPlus, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { Modal } from '@/components/common/modal';
import { CITIES } from '@/components/home/top-navbar';

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

function SearchableSelect({ value, onChange, options, placeholder }: { value: string, onChange: (v: string) => void, options: string[], placeholder: string }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));
  
  return (
    <div className="relative">
      <div 
        className="w-full border rounded p-2 text-sm cursor-pointer bg-white"
        onClick={() => { setOpen(!open); setSearch(''); }}
      >
        {value || placeholder}
      </div>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)}></div>
          <div className="absolute z-20 w-full mt-1 bg-white border rounded shadow-lg max-h-48 overflow-y-auto">
            <input 
              type="text" 
              className="w-full p-2 border-b text-sm focus:outline-none sticky top-0 bg-white" 
              placeholder="Search..."
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {filtered.length === 0 && <div className="p-2 text-sm text-gray-500">No options found</div>}
            {filtered.map(opt => (
              <div 
                key={opt}
                className="p-2 text-sm hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
              >
                {opt}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [errorModal, setErrorModal] = useState<{isOpen: boolean, message: string}>({isOpen: false, message: ''});
  const [actionModal, setActionModal] = useState<{isOpen: boolean, id: string, action: string, type: 'confirm' | 'error', message: string}>({isOpen: false, id: '', action: '', type: 'confirm', message: ''});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewCustomer, setViewCustomer] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '',
    vehicleNumber: '', vehicleModel: '', vehicleBrand: '', vehicleType: '', status: 'active'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const data = await apiClient.get<any[]>('/admin/users');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.post('/admin/users', formData);
      setIsAddModalOpen(false);
      loadData();
      setFormData({
        name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '',
        vehicleNumber: '', vehicleModel: '', vehicleBrand: '', vehicleType: '', status: 'active'
      });
      setToastMessage({ type: 'success', text: 'Customer created successfully.' });
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: any) {
      setErrorModal({isOpen: true, message: err?.message || 'Error creating customer'});
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAction = async (id: string, action: string) => {
    try {
      await apiClient.post(`/admin/users/${id}/${action}`);
      setActionModal({isOpen: false, id: '', action: '', type: 'confirm', message: ''});
      loadData();
    } catch (err) {
      setActionModal({isOpen: true, id: '', action: '', type: 'error', message: `Failed to ${action} customer.`});
      console.error('Failed to update status', err);
    }
  };

  const confirmAction = () => {
    handleAction(actionModal.id, actionModal.action);
  };

  const filtered = customers.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filtered.length, totalPages, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const paginatedCustomers = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
         <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
         <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
            <UserPlus className="w-4 h-4"/> Add Customer
         </button>
      </div>

      <Card className="shadow-sm border-slate-200">
        <div className="p-4 border-b border-slate-100">
          <div className="relative w-full">
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
                <th className="p-4 font-semibold w-1/5">Name</th>
                <th className="p-4 font-semibold w-1/5">Email</th>
                <th className="p-4 font-semibold w-1/5">Status</th>
                <th className="p-4 font-semibold w-1/5">Created Date</th>
                <th className="p-4 font-semibold w-1/5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                 <tr><td colSpan={5} className="p-8 text-center text-sm text-slate-500">Loading...</td></tr>
              ) : paginatedCustomers.length === 0 ? (
                 <tr><td colSpan={5} className="p-8 text-center text-sm text-slate-500">No Records Found.</td></tr>
              ) : (
                paginatedCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-sm font-semibold text-slate-900">{c.name}</td>
                    <td className="p-4 text-sm text-slate-700">{c.email}</td>
                    <td className="p-4 text-sm text-slate-700">
                       <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${
                         c.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 
                         c.status === 'suspended' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                         'bg-red-50 text-red-700 border-red-100'
                       }`}>
                         {c.status}
                       </span>
                    </td>
                    <td className="p-4 text-sm text-slate-700">{new Date(c.joined).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="p-4 text-right flex gap-2 justify-end items-center">
                       <button onClick={() => setViewCustomer(c)} className="text-slate-500 hover:text-blue-600 transition-colors p-1" title="View Customer Details">
                         <Eye className="w-4 h-4" />
                       </button>
                       {c.status !== 'active' && (
                         <button onClick={() => setActionModal({isOpen: true, id: c.id, action: 'verify', type: 'confirm', message: 'Are you sure you want to verify this customer?'})} className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">Verify</button>
                       )}
                       {c.status !== 'rejected' && (
                         <button onClick={() => setActionModal({isOpen: true, id: c.id, action: 'reject', type: 'confirm', message: 'Are you sure you want to reject this customer?'})} className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">Reject</button>
                       )}
                       {c.status === 'suspended' && (
                         <button onClick={() => setActionModal({isOpen: true, id: c.id, action: 'activate', type: 'confirm', message: 'Are you sure you want to activate this customer?'})} className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">Activate</button>
                       )}
                       {c.status === 'active' && (
                         <button onClick={() => setActionModal({isOpen: true, id: c.id, action: 'suspend', type: 'confirm', message: 'Are you sure you want to suspend this customer?'})} className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg">Suspend</button>
                       )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-white">
              <span className="text-sm text-slate-500">Page {currentPage} of {totalPages}</span>
              <div className="flex gap-2">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 bg-slate-100 rounded text-sm disabled:opacity-50 hover:bg-slate-200 transition-colors">Prev</button>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 bg-slate-100 rounded text-sm disabled:opacity-50 hover:bg-slate-200 transition-colors">Next</button>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Customer">
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-2">
           <div className="grid grid-cols-2 gap-4">
             <div><label className="block text-xs font-semibold mb-1">Name</label><input required className="w-full border rounded p-2 text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
             <div><label className="block text-xs font-semibold mb-1">Email</label><input required type="email" className="w-full border rounded p-2 text-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
             <div><label className="block text-xs font-semibold mb-1">Phone</label><input className="w-full border rounded p-2 text-sm" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
             <div><label className="block text-xs font-semibold mb-1">Status</label>
               <select className="w-full border rounded p-2 text-sm" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                 <option value="active">Active</option>
                 <option value="suspended">Suspended</option>
               </select>
             </div>
           </div>
           
           <h3 className="text-sm font-bold border-b pb-1 mt-4">Address Details</h3>
           <div className="grid grid-cols-2 gap-4">
             <div className="col-span-2"><label className="block text-xs font-semibold mb-1">Address</label><input className="w-full border rounded p-2 text-sm" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} /></div>
             <div><label className="block text-xs font-semibold mb-1">City</label><SearchableSelect value={formData.city} onChange={v => setFormData({...formData, city: v})} options={CITIES} placeholder="Select City" /></div>
             <div><label className="block text-xs font-semibold mb-1">State</label><SearchableSelect value={formData.state} onChange={v => setFormData({...formData, state: v})} options={STATES} placeholder="Select State" /></div>
             <div><label className="block text-xs font-semibold mb-1">Pincode</label><input className="w-full border rounded p-2 text-sm" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} /></div>
           </div>

           <h3 className="text-sm font-bold border-b pb-1 mt-4">Vehicle Details</h3>
           <div className="grid grid-cols-2 gap-4">
             <div><label className="block text-xs font-semibold mb-1">Vehicle Number</label><input className="w-full border rounded p-2 text-sm" value={formData.vehicleNumber} onChange={e => setFormData({...formData, vehicleNumber: e.target.value})} /></div>
             <div><label className="block text-xs font-semibold mb-1">Vehicle Brand</label><input className="w-full border rounded p-2 text-sm" value={formData.vehicleBrand} onChange={e => setFormData({...formData, vehicleBrand: e.target.value})} /></div>
             <div><label className="block text-xs font-semibold mb-1">Vehicle Model</label><input className="w-full border rounded p-2 text-sm" value={formData.vehicleModel} onChange={e => setFormData({...formData, vehicleModel: e.target.value})} /></div>
             <div><label className="block text-xs font-semibold mb-1">Vehicle Type</label><input className="w-full border rounded p-2 text-sm" value={formData.vehicleType} onChange={e => setFormData({...formData, vehicleType: e.target.value})} /></div>
           </div>

           <h3 className="text-sm font-bold border-b pb-1 mt-4">Documents</h3>
           <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-dashed border-slate-300">
             Note: Document storage is not available in the current demo. You may select files, but they will not be persisted to the database.
           </div>
           <div className="grid grid-cols-2 gap-4">
             <div><label className="block text-xs font-semibold mb-1">Aadhaar Upload</label><input type="file" className="w-full text-xs" /></div>
             <div><label className="block text-xs font-semibold mb-1">Driving License Upload</label><input type="file" className="w-full text-xs" /></div>
           </div>

           <div className="pt-4 flex gap-2">
             <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-2 border rounded-lg text-sm font-bold">Cancel</button>
             <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-[#1a56db] rounded-lg hover:bg-[#174ec5]">
              {isSubmitting ? 'Saving...' : 'Save Customer'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={errorModal.isOpen} onClose={() => setErrorModal({isOpen: false, message: ''})} title="Error">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">{errorModal.message}</p>
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button onClick={() => setErrorModal({isOpen: false, message: ''})} className="px-4 py-2 text-sm font-medium text-white bg-[#1a56db] rounded-lg hover:bg-[#174ec5]">
              Close
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={actionModal.isOpen && actionModal.type === 'confirm'} onClose={() => setActionModal({isOpen: false, id: '', action: '', type: 'confirm', message: ''})} title="Confirm Action" className="max-w-md">
        <p className="text-sm text-slate-600 mb-6">{actionModal.message}</p>
        <div className="flex justify-end gap-3">
           <button onClick={() => setActionModal({isOpen: false, id: '', action: '', type: 'confirm', message: ''})} className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
           <button onClick={confirmAction} className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">Confirm</button>
        </div>
      </Modal>
      
      <Modal isOpen={actionModal.isOpen && actionModal.type === 'error'} onClose={() => setActionModal({isOpen: false, id: '', action: '', type: 'confirm', message: ''})} title="Error" className="max-w-md">
        <p className="text-sm text-slate-600 mb-6">{actionModal.message}</p>
        <div className="flex justify-end gap-3">
           <button onClick={() => setActionModal({isOpen: false, id: '', action: '', type: 'confirm', message: ''})} className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">Close</button>
        </div>
      </Modal>

      <Modal isOpen={!!viewCustomer} onClose={() => setViewCustomer(null)} title="Customer Details" className="max-w-2xl">
        {viewCustomer && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 font-bold mb-1">Customer Name</p>
                <p className="text-sm font-semibold text-slate-900">{viewCustomer.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold mb-1">Email</p>
                <p className="text-sm font-semibold text-slate-900">{viewCustomer.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold mb-1">Phone</p>
                <p className="text-sm font-semibold text-slate-900">{viewCustomer.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold mb-1">Status</p>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border inline-block ${
                  viewCustomer.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 
                  viewCustomer.status === 'suspended' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                  'bg-red-50 text-red-700 border-red-100'
                }`}>
                  {viewCustomer.status || 'Unknown'}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold mb-1">Created Date</p>
                <p className="text-sm font-semibold text-slate-900">
                  {viewCustomer.joined ? new Date(viewCustomer.joined).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <p className="text-sm font-bold text-[#17307a] mb-3">Location Information</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 font-bold mb-1">Address</p>
                  <p className="text-sm font-semibold text-slate-900">{viewCustomer.address || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold mb-1">City / State</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {[viewCustomer.city, viewCustomer.state].filter(Boolean).join(', ') || 'N/A'}
                    {viewCustomer.pincode ? ` - ${viewCustomer.pincode}` : ''}
                  </p>
                </div>
              </div>
            </div>

            {(viewCustomer.vehicleNumber || viewCustomer.vehicleModel || viewCustomer.vehicleBrand) && (
              <div className="border-t border-slate-100 pt-4">
                <p className="text-sm font-bold text-[#17307a] mb-3">Vehicle Details</p>
                <div className="grid grid-cols-2 gap-4">
                  {viewCustomer.vehicleNumber && (
                    <div>
                      <p className="text-xs text-slate-500 font-bold mb-1">Vehicle Number</p>
                      <p className="text-sm font-semibold text-slate-900">{viewCustomer.vehicleNumber}</p>
                    </div>
                  )}
                  {viewCustomer.vehicleBrand && (
                    <div>
                      <p className="text-xs text-slate-500 font-bold mb-1">Brand</p>
                      <p className="text-sm font-semibold text-slate-900">{viewCustomer.vehicleBrand}</p>
                    </div>
                  )}
                  {viewCustomer.vehicleModel && (
                    <div>
                      <p className="text-xs text-slate-500 font-bold mb-1">Model / Type</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {[viewCustomer.vehicleModel, viewCustomer.vehicleType].filter(Boolean).join(' - ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {toastMessage && (
        <div className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-xl text-white font-bold z-50 flex items-center gap-3 transition-all transform translate-y-0 ${toastMessage.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toastMessage.text}
        </div>
      )}
    </div>
  );
}
