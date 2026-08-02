const fs = require('fs');
const path = require('path');

const writePage = (dirPath, content) => {
  const fullPath = path.join(__dirname, '../src/app/admin', dirPath, 'page.tsx');
  if (fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, content, 'utf8');
  }
};

const suspendedGaragesPage = `
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
`;

const customerVerificationPage = `
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
      await apiClient.post(\`/admin/users/\${id}/\${action}\`);
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
`;

const customersPage = `
'use client';
import { Card } from '@/components/common/card';
import { Search, UserPlus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { Modal } from '@/components/common/modal';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
    } catch (err) {
      alert('Error creating customer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAction = async (id: string, action: string) => {
    try {
      await apiClient.post(\`/admin/users/\${id}/\${action}\`);
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
                <th className="p-4 font-semibold w-1/4">Name</th>
                <th className="p-4 font-semibold w-1/4">Email</th>
                <th className="p-4 font-semibold w-1/4">Status</th>
                <th className="p-4 font-semibold w-1/4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                 <tr><td colSpan={4} className="p-8 text-center text-sm text-slate-500">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                 <tr><td colSpan={4} className="p-8 text-center text-sm text-slate-500">No Records Found.</td></tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-sm font-semibold text-slate-900">{c.name}</td>
                    <td className="p-4 text-sm text-slate-700">{c.email}</td>
                    <td className="p-4 text-sm text-slate-700">
                       <span className={\`px-2 py-1 rounded-full text-xs font-medium \${c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}\`}>
                         {c.status}
                       </span>
                    </td>
                    <td className="p-4 text-right">
                       {c.status !== 'active' ? (
                         <button onClick={() => handleAction(c.id, 'activate')} className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">Activate</button>
                       ) : (
                         <button onClick={() => handleAction(c.id, 'suspend')} className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg">Suspend</button>
                       )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
             <div><label className="block text-xs font-semibold mb-1">City</label><input className="w-full border rounded p-2 text-sm" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} /></div>
             <div><label className="block text-xs font-semibold mb-1">State</label><input className="w-full border rounded p-2 text-sm" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} /></div>
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
             <button type="submit" disabled={isSubmitting} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">{isSubmitting ? 'Saving...' : 'Save Customer'}</button>
           </div>
        </form>
      </Modal>
    </div>
  );
}
`;

const serviceRequestsPage = `
'use client';
import { Card } from '@/components/common/card';
import { Search, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { Modal } from '@/components/common/modal';

export default function AdminServiceRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '', garageId: '', vehicleId: '', serviceType: '', priority: 'Medium', description: '', preferredDate: '', status: 'pending'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const data = await apiClient.get<any[]>('/admin/service-requests').catch(() => []);
      setRequests(data);
    } catch (err) {
      console.error('Failed to load requests', err);
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
      await apiClient.post('/admin/service-requests', formData);
      setIsAddModalOpen(false);
      loadData();
      setFormData({customerId: '', garageId: '', vehicleId: '', serviceType: '', priority: 'Medium', description: '', preferredDate: '', status: 'pending'});
    } catch (err) {
      alert('Error creating request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = requests.filter(r => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return r.customerName?.toLowerCase().includes(q) || r.id?.toLowerCase().includes(q);
  });

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
         <h1 className="text-2xl font-bold text-slate-900">Service Requests</h1>
         <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            New Service Request
         </button>
      </div>

      <Card className="shadow-sm border-slate-200">
        <div className="p-4 border-b border-slate-100">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="text" placeholder="Search requests..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-50/50 text-xs font-semibold text-slate-500 border-b border-slate-100">
                <th className="p-4 font-semibold w-1/4">Request ID</th>
                <th className="p-4 font-semibold w-1/4">Customer</th>
                <th className="p-4 font-semibold w-1/4">Status</th>
                <th className="p-4 font-semibold w-1/4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                 <tr><td colSpan={4} className="p-8 text-center text-sm text-slate-500">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                 <tr><td colSpan={4} className="p-8 text-center text-sm text-slate-500">No Records Found.</td></tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} onClick={() => { setSelectedRequest(r); setIsModalOpen(true); }} className="hover:bg-slate-50/50 cursor-pointer transition-colors">
                    <td className="p-4 text-sm font-semibold text-slate-900">{r.id.substring(0,8)}</td>
                    <td className="p-4 text-sm text-slate-700">{r.customerName || 'N/A'}</td>
                    <td className="p-4 text-sm text-slate-700">{r.status}</td>
                    <td className="p-4 text-right">
                       <button className="text-slate-400 hover:text-blue-600 px-2"><Eye className="w-4 h-4 inline"/></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* View Request Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Service Request Details">
         <div className="space-y-4">
            {selectedRequest ? (
               <div className="text-sm text-slate-600 space-y-2">
                 <p><strong>ID:</strong> {selectedRequest.id}</p>
                 <p><strong>Customer:</strong> {selectedRequest.customerName || 'N/A'}</p>
                 <p><strong>Status:</strong> {selectedRequest.status}</p>
                 <p><strong>Details:</strong> {selectedRequest.details || 'N/A'}</p>
               </div>
            ) : <p>Loading...</p>}
            <button onClick={() => setIsModalOpen(false)} className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">Close</button>
         </div>
      </Modal>

      {/* Add Request Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="New Service Request">
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-2">
           <div className="grid grid-cols-1 gap-4">
             <div><label className="block text-xs font-semibold mb-1">Customer ID (Optional)</label><input className="w-full border rounded p-2 text-sm" value={formData.customerId} onChange={e => setFormData({...formData, customerId: e.target.value})} /></div>
             <div><label className="block text-xs font-semibold mb-1">Garage ID (Optional)</label><input className="w-full border rounded p-2 text-sm" value={formData.garageId} onChange={e => setFormData({...formData, garageId: e.target.value})} /></div>
             <div><label className="block text-xs font-semibold mb-1">Vehicle ID (Optional)</label><input className="w-full border rounded p-2 text-sm" value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})} /></div>
             <div><label className="block text-xs font-semibold mb-1">Service Type</label><input className="w-full border rounded p-2 text-sm" value={formData.serviceType} onChange={e => setFormData({...formData, serviceType: e.target.value})} /></div>
             <div><label className="block text-xs font-semibold mb-1">Priority</label>
               <select className="w-full border rounded p-2 text-sm" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                 <option>Low</option>
                 <option>Medium</option>
                 <option>High</option>
               </select>
             </div>
             <div><label className="block text-xs font-semibold mb-1">Preferred Date</label><input type="date" className="w-full border rounded p-2 text-sm" value={formData.preferredDate} onChange={e => setFormData({...formData, preferredDate: e.target.value})} /></div>
             <div><label className="block text-xs font-semibold mb-1">Description</label><textarea className="w-full border rounded p-2 text-sm" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
           </div>

           <div className="pt-4 flex gap-2">
             <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-2 border rounded-lg text-sm font-bold">Cancel</button>
             <button type="submit" disabled={isSubmitting} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">{isSubmitting ? 'Saving...' : 'Create Request'}</button>
           </div>
        </form>
      </Modal>
    </div>
  );
}
`;

writePage('garages/suspended', suspendedGaragesPage);
writePage('users/verification', customerVerificationPage);
writePage('users', customersPage);
writePage('service-requests', serviceRequestsPage);

console.log('UI files updated.');
