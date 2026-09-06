
'use client';
import { Card } from '@/components/common/card';
import { Search, UserPlus, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
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
            {search.trim().length > 0 && !options.some(o => o.toLowerCase() === search.trim().toLowerCase()) && (
              <div 
                className="p-2 text-sm hover:bg-blue-50 cursor-pointer text-blue-600 font-medium"
                onClick={() => {
                  onChange(search.trim());
                  setOpen(false);
                }}
              >
                Use "{search.trim()}"
              </div>
            )}
            {filtered.length === 0 && search.trim().length === 0 && <div className="p-2 text-sm text-gray-500">No options found</div>}
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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '',
    vehicleNumber: '', vehicleModel: '', vehicleBrand: '', mileage: '', fuelType: '', year: '', status: 'active'
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

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name?.trim()) errors.name = 'Name is required.';
    if (!formData.email?.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'A valid email is required.';
    }
    if (!formData.phone?.trim()) errors.phone = 'Phone is required.';
    if (!formData.status?.trim()) errors.status = 'Status is required.';
    if (!formData.address?.trim()) errors.address = 'Address is required.';
    if (!formData.city?.trim()) errors.city = 'City is required.';
    if (!formData.state?.trim()) errors.state = 'State is required.';
    if (!formData.pincode?.trim()) errors.pincode = 'Pincode is required.';
    if (!formData.vehicleNumber?.trim()) errors.vehicleNumber = 'Vehicle Number is required.';
    if (!formData.vehicleBrand?.trim()) errors.vehicleBrand = 'Vehicle Brand is required.';
    if (!formData.vehicleModel?.trim()) errors.vehicleModel = 'Vehicle Model is required.';
    
    const mileageNum = formData.mileage !== undefined && formData.mileage !== null && String(formData.mileage).trim() !== '' ? Number(formData.mileage) : NaN;
    if (formData.mileage === undefined || formData.mileage === null || String(formData.mileage).trim() === '' || isNaN(mileageNum) || mileageNum < 0 || !Number.isInteger(mileageNum)) {
      errors.mileage = 'Please enter a valid mileage.';
    }

    if (!formData.fuelType?.trim()) errors.fuelType = 'Fuel Type is required.';
    if (!formData.year?.trim()) errors.year = 'Year is required.';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await apiClient.post('/admin/users', formData);
      setIsAddModalOpen(false);
      loadData();
      setFormData({
        name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '',
        vehicleNumber: '', vehicleModel: '', vehicleBrand: '', mileage: '', fuelType: '', year: '', status: 'active'
      });
      setFormErrors({});
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

  const startIndex = filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, filtered.length);

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
                Showing {startIndex} - {endIndex} of {filtered.length} customers
              </div>
            </div>
          )}
        </div>
      </Card>

      <Modal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(false); setFormErrors({}); }} title="Add New Customer">
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-2">
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-xs font-semibold mb-1">Name <span className="text-red-500">*</span></label>
               <input className={`w-full border rounded p-2 text-sm ${formErrors.name ? 'border-red-500 bg-red-50' : ''}`} value={formData.name} onChange={e => { setFormData({...formData, name: e.target.value}); if (formErrors.name) setFormErrors({...formErrors, name: ''}); }} />
               {formErrors.name && <p className="text-xs text-red-500 mt-1 font-medium">{formErrors.name}</p>}
             </div>
             <div>
               <label className="block text-xs font-semibold mb-1">Email <span className="text-red-500">*</span></label>
               <input type="email" className={`w-full border rounded p-2 text-sm ${formErrors.email ? 'border-red-500 bg-red-50' : ''}`} value={formData.email} onChange={e => { setFormData({...formData, email: e.target.value}); if (formErrors.email) setFormErrors({...formErrors, email: ''}); }} />
               {formErrors.email && <p className="text-xs text-red-500 mt-1 font-medium">{formErrors.email}</p>}
             </div>
             <div>
               <label className="block text-xs font-semibold mb-1">Phone <span className="text-red-500">*</span></label>
               <input className={`w-full border rounded p-2 text-sm ${formErrors.phone ? 'border-red-500 bg-red-50' : ''}`} value={formData.phone} onChange={e => { setFormData({...formData, phone: e.target.value}); if (formErrors.phone) setFormErrors({...formErrors, phone: ''}); }} />
               {formErrors.phone && <p className="text-xs text-red-500 mt-1 font-medium">{formErrors.phone}</p>}
             </div>
             <div>
               <label className="block text-xs font-semibold mb-1">Status <span className="text-red-500">*</span></label>
               <select className="w-full border rounded p-2 text-sm" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                 <option value="active">Active</option>
                 <option value="suspended">Suspended</option>
               </select>
             </div>
           </div>
           
           <h3 className="text-sm font-bold border-b pb-1 mt-4">Address Details</h3>
           <div className="grid grid-cols-2 gap-4">
             <div className="col-span-2">
               <label className="block text-xs font-semibold mb-1">Address <span className="text-red-500">*</span></label>
               <input className={`w-full border rounded p-2 text-sm ${formErrors.address ? 'border-red-500 bg-red-50' : ''}`} value={formData.address} onChange={e => { setFormData({...formData, address: e.target.value}); if (formErrors.address) setFormErrors({...formErrors, address: ''}); }} />
               {formErrors.address && <p className="text-xs text-red-500 mt-1 font-medium">{formErrors.address}</p>}
             </div>
             <div>
               <label className="block text-xs font-semibold mb-1">City <span className="text-red-500">*</span></label>
               <div className={formErrors.city ? 'border border-red-500 rounded bg-red-50' : ''}>
                 <SearchableSelect value={formData.city} onChange={v => { setFormData({...formData, city: v}); if (formErrors.city) setFormErrors({...formErrors, city: ''}); }} options={CITIES} placeholder="Select City" />
               </div>
               {formErrors.city && <p className="text-xs text-red-500 mt-1 font-medium">{formErrors.city}</p>}
             </div>
             <div>
               <label className="block text-xs font-semibold mb-1">State <span className="text-red-500">*</span></label>
               <div className={formErrors.state ? 'border border-red-500 rounded bg-red-50' : ''}>
                 <SearchableSelect value={formData.state} onChange={v => { setFormData({...formData, state: v}); if (formErrors.state) setFormErrors({...formErrors, state: ''}); }} options={STATES} placeholder="Select State" />
               </div>
               {formErrors.state && <p className="text-xs text-red-500 mt-1 font-medium">{formErrors.state}</p>}
             </div>
             <div>
               <label className="block text-xs font-semibold mb-1">Pincode <span className="text-red-500">*</span></label>
               <input className={`w-full border rounded p-2 text-sm ${formErrors.pincode ? 'border-red-500 bg-red-50' : ''}`} value={formData.pincode} onChange={e => { setFormData({...formData, pincode: e.target.value}); if (formErrors.pincode) setFormErrors({...formErrors, pincode: ''}); }} />
               {formErrors.pincode && <p className="text-xs text-red-500 mt-1 font-medium">{formErrors.pincode}</p>}
             </div>
           </div>

           <h3 className="text-sm font-bold border-b pb-1 mt-4">Vehicle Details</h3>
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-xs font-semibold mb-1">Vehicle Number <span className="text-red-500">*</span></label>
               <input className={`w-full border rounded p-2 text-sm ${formErrors.vehicleNumber ? 'border-red-500 bg-red-50' : ''}`} value={formData.vehicleNumber} onChange={e => { setFormData({...formData, vehicleNumber: e.target.value}); if (formErrors.vehicleNumber) setFormErrors({...formErrors, vehicleNumber: ''}); }} />
               {formErrors.vehicleNumber && <p className="text-xs text-red-500 mt-1 font-medium">{formErrors.vehicleNumber}</p>}
             </div>
             <div>
               <label className="block text-xs font-semibold mb-1">Vehicle Brand <span className="text-red-500">*</span></label>
               <input className={`w-full border rounded p-2 text-sm ${formErrors.vehicleBrand ? 'border-red-500 bg-red-50' : ''}`} value={formData.vehicleBrand} onChange={e => { setFormData({...formData, vehicleBrand: e.target.value}); if (formErrors.vehicleBrand) setFormErrors({...formErrors, vehicleBrand: ''}); }} />
               {formErrors.vehicleBrand && <p className="text-xs text-red-500 mt-1 font-medium">{formErrors.vehicleBrand}</p>}
             </div>
             <div>
               <label className="block text-xs font-semibold mb-1">Vehicle Model <span className="text-red-500">*</span></label>
               <input className={`w-full border rounded p-2 text-sm ${formErrors.vehicleModel ? 'border-red-500 bg-red-50' : ''}`} value={formData.vehicleModel} onChange={e => { setFormData({...formData, vehicleModel: e.target.value}); if (formErrors.vehicleModel) setFormErrors({...formErrors, vehicleModel: ''}); }} />
               {formErrors.vehicleModel && <p className="text-xs text-red-500 mt-1 font-medium">{formErrors.vehicleModel}</p>}
             </div>
             <div>
               <label className="block text-xs font-semibold mb-1">Mileage (miles) <span className="text-red-500">*</span></label>
               <input type="number" placeholder="e.g. 45000" className={`w-full border rounded p-2 text-sm ${formErrors.mileage ? 'border-red-500 bg-red-50' : ''}`} value={formData.mileage} onChange={e => { setFormData({...formData, mileage: e.target.value}); if (formErrors.mileage) setFormErrors({...formErrors, mileage: ''}); }} />
               {formErrors.mileage && <p className="text-xs text-red-500 mt-1 font-medium">{formErrors.mileage}</p>}
             </div>
             <div>
               <label className="block text-xs font-semibold mb-1">Fuel Type <span className="text-red-500">*</span></label>
               <select className={`w-full border rounded p-2 text-sm ${formErrors.fuelType ? 'border-red-500 bg-red-50' : ''}`} value={formData.fuelType} onChange={e => { setFormData({...formData, fuelType: e.target.value}); if (formErrors.fuelType) setFormErrors({...formErrors, fuelType: ''}); }}>
                 <option value="">Select Fuel Type</option>
                 <option value="Petrol">Petrol</option>
                 <option value="Diesel">Diesel</option>
                 <option value="CNG">CNG</option>
                 <option value="Electric">Electric</option>
                 <option value="Hybrid">Hybrid</option>
               </select>
               {formErrors.fuelType && <p className="text-xs text-red-500 mt-1 font-medium">{formErrors.fuelType}</p>}
             </div>
             <div>
               <label className="block text-xs font-semibold mb-1">Year <span className="text-red-500">*</span></label>
               <select className={`w-full border rounded p-2 text-sm ${formErrors.year ? 'border-red-500 bg-red-50' : ''}`} value={formData.year} onChange={e => { setFormData({...formData, year: e.target.value}); if (formErrors.year) setFormErrors({...formErrors, year: ''}); }}>
                 <option value="">Select Year</option>
                 {Array.from({ length: new Date().getFullYear() - 1989 }, (_, i) => (new Date().getFullYear() - i).toString()).map(y => (
                   <option key={y} value={y}>{y}</option>
                 ))}
               </select>
               {formErrors.year && <p className="text-xs text-red-500 mt-1 font-medium">{formErrors.year}</p>}
             </div>
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

      <Modal isOpen={!!viewCustomer} onClose={() => setViewCustomer(null)} title="Customer Details" className="max-w-lg">
        {viewCustomer && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">Name</p>
                <p className="text-sm font-semibold text-slate-900">{viewCustomer.name || 'N/A'}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">Email</p>
                <p className="text-sm font-semibold text-slate-900 truncate" title={viewCustomer.email}>{viewCustomer.email || 'N/A'}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">Phone</p>
                <p className="text-sm font-semibold text-slate-900">{viewCustomer.phone || 'N/A'}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">Joined</p>
                <p className="text-sm font-semibold text-slate-900">
                  {viewCustomer.joined ? new Date(viewCustomer.joined).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-1">Status</p>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border inline-block ${
                  viewCustomer.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 
                  viewCustomer.status === 'suspended' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                  'bg-red-50 text-red-700 border-red-100'
                }`}>
                  {viewCustomer.status || 'Unknown'}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <p className="text-xs font-bold text-[#17307a] uppercase tracking-wider mb-2">Location & Activity</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">Address</p>
                  <p className="text-sm font-semibold text-slate-900 truncate" title={viewCustomer.address || ''}>{viewCustomer.address || 'N/A'}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">City / State</p>
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {[viewCustomer.city, viewCustomer.state].filter(Boolean).join(', ') || 'N/A'}
                    {viewCustomer.pincode ? ` - ${viewCustomer.pincode}` : ''}
                  </p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">Total Bookings</p>
                  <p className="text-sm font-semibold text-slate-900">{viewCustomer.bookings || 0}</p>
                </div>
              </div>
            </div>

            {viewCustomer.vehicles_list && viewCustomer.vehicles_list.length > 0 && viewCustomer.vehicles_list[0] !== null && (
              <div className="border-t border-slate-100 pt-3">
                <p className="text-xs font-bold text-[#17307a] uppercase tracking-wider mb-2">Vehicles ({viewCustomer.vehicles_list.length})</p>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                  {viewCustomer.vehicles_list.map((v: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 p-2.5 rounded border border-slate-100">
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                        {v.vehicleNumber && (
                          <div className="col-span-2 sm:col-span-1">
                            <p className="text-[10px] uppercase text-slate-500 font-bold mb-0.5">Number</p>
                            <p className="text-xs font-bold text-slate-900">{v.vehicleNumber}</p>
                          </div>
                        )}
                        {v.vehicleBrand && (
                          <div className="col-span-2 sm:col-span-1">
                            <p className="text-[10px] uppercase text-slate-500 font-bold mb-0.5">Brand</p>
                            <p className="text-xs font-semibold text-slate-900">{v.vehicleBrand}</p>
                          </div>
                        )}
                        {v.vehicleModel && (
                          <div className="col-span-2 sm:col-span-1">
                            <p className="text-[10px] uppercase text-slate-500 font-bold mb-0.5">Model / Type</p>
                            <p className="text-xs font-semibold text-slate-900">
                              {[v.vehicleModel, v.vehicleType].filter(Boolean).join(' - ')}
                            </p>
                          </div>
                        )}
                        {(v.fuelType || v.year) && (
                          <div className="col-span-2 sm:col-span-1">
                            <p className="text-[10px] uppercase text-slate-500 font-bold mb-0.5">Fuel / Year</p>
                            <p className="text-xs font-semibold text-slate-900">
                              {[v.fuelType, v.year].filter(Boolean).join(' - ') || 'N/A'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
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
