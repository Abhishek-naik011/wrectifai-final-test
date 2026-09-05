'use client';
import { RoleGuard } from '@/components/common/role-guard';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { DashboardHeader } from '@/components/common/dashboard-header';
import { garageNavItems } from '@/lib/garage-config';
import { useState, useEffect } from 'react';
import { fetchGarageCustomers, fetchGarageCustomerDetails, GarageCustomer, GarageCustomerDetails } from '@/lib/garages-api';
import { Search, User, Car, FileText, Calendar, X } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<GarageCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedCustomer, setSelectedCustomer] = useState<GarageCustomer | null>(null);
  const [customerDetails, setCustomerDetails] = useState<GarageCustomerDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await fetchGarageCustomers();
      setCustomers(data || []);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  }

  const handleSelectCustomer = async (cust: GarageCustomer) => {
    setSelectedCustomer(cust);
    setDetailsLoading(true);
    setCustomerDetails(null);
    try {
      const data = await fetchGarageCustomerDetails(cust.id);
      setCustomerDetails(data);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.phone && c.phone.includes(searchQuery))
  );

  const formatDate = (isoStr: string) => {
    if (!isoStr) return '';
    return new Date(isoStr).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <RoleGuard allowedRoles={['garage']}>
      <DashboardShell customNavItems={garageNavItems} hideBottomWidget={true} header={<DashboardHeader />}>
        <div className="p-6 bg-slate-50 min-h-screen">
          
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Customers</h1>
              <p className="text-slate-500 text-sm">Customers connected to your Garage via Quotes or Bookings</p>
            </div>
            
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search customers..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg w-full md:w-64 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse text-sm">
                 <thead className="bg-slate-100">
                   <tr>
                     <th className="p-4 font-bold text-slate-600 border-b">Customer Name</th>
                     <th className="p-4 font-bold text-slate-600 border-b">Contact Info</th>
                     <th className="p-4 font-bold text-slate-600 border-b">First Interaction</th>
                     <th className="p-4 font-bold text-slate-600 border-b text-center">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {loading ? (
                       <tr>
                          <td colSpan={4} className="p-8 text-center text-slate-500">Loading customers...</td>
                       </tr>
                   ) : errorMsg ? (
                       <tr>
                          <td colSpan={4} className="p-8 text-center text-red-500 font-medium">{errorMsg}</td>
                       </tr>
                   ) : filteredCustomers.length === 0 ? (
                       <tr>
                          <td colSpan={4} className="p-8 text-center text-slate-500">No customers found.</td>
                       </tr>
                   ) : filteredCustomers.map(cust => (
                     <tr key={cust.id} className="hover:bg-slate-50">
                       <td className="p-4 text-slate-800 font-medium">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                             {cust.name.charAt(0).toUpperCase()}
                           </div>
                           {cust.name}
                         </div>
                       </td>
                       <td className="p-4 text-slate-600">
                         <div className="flex flex-col">
                           <span>{cust.email}</span>
                           <span className="text-xs text-slate-400">{cust.phone || 'No phone'}</span>
                         </div>
                       </td>
                       <td className="p-4 text-slate-600">{formatDate(cust.joinDate)}</td>
                       <td className="p-4 text-center">
                         <button 
                           onClick={() => handleSelectCustomer(cust)} 
                           className="text-blue-600 font-bold hover:underline"
                         >
                           View Details
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
          
        </div>
      </DashboardShell>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h2 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-blue-600" />
                Customer Profile
              </h2>
              <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-slate-600 font-bold">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto bg-slate-50 flex-1">
              {detailsLoading ? (
                <div className="py-8 text-center text-slate-500 text-sm">Loading customer details...</div>
              ) : !customerDetails ? (
                <div className="py-8 text-center text-red-500 text-sm">Could not load details.</div>
              ) : (
                <div className="space-y-4">
                  
                  {/* Info Card */}
                  <div className="bg-white p-4 rounded border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-3">
                     <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl shrink-0">
                       {customerDetails.customer.name.charAt(0).toUpperCase()}
                     </div>
                     <div>
                       <h3 className="text-base font-bold text-slate-800">{customerDetails.customer.name}</h3>
                       <p className="text-slate-600 text-xs mt-0.5">{customerDetails.customer.email}</p>
                       <p className="text-slate-500 text-xs">{customerDetails.customer.phone || 'No phone provided'}</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Vehicles */}
                    <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                      <div className="p-2 border-b border-slate-200 bg-slate-50 font-bold text-slate-700 flex items-center gap-2 text-xs">
                        <Car className="w-3.5 h-3.5 text-blue-600" /> Vehicles
                      </div>
                      <div className="p-3 space-y-2 flex-1">
                        {customerDetails.vehicles.length === 0 ? (
                          <p className="text-xs text-slate-500 italic">No vehicles associated.</p>
                        ) : (
                          customerDetails.vehicles.map((v: any) => (
                            <div key={v.id} className="border border-slate-100 rounded p-2.5 bg-slate-50">
                              <p className="font-bold text-slate-800 text-xs">{v.year} {v.make} {v.model}</p>
                              {v.vin && <p className="text-[10px] text-slate-500 mt-0.5">VIN: {v.vin}</p>}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Bookings */}
                    <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                      <div className="p-2 border-b border-slate-200 bg-slate-50 font-bold text-slate-700 flex items-center gap-2 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" /> Bookings & History
                      </div>
                      <div className="p-3 space-y-2 flex-1">
                        {customerDetails.bookings.length === 0 ? (
                          <p className="text-xs text-slate-500 italic">No bookings found.</p>
                        ) : (
                          customerDetails.bookings.map((b: any) => (
                            <div key={b.id} className="border border-slate-100 rounded p-2.5 bg-slate-50 flex justify-between items-center">
                              <div>
                                <p className="text-[10px] text-slate-500">Date: {formatDate(b.createdAt)}</p>
                                <p className="font-bold text-slate-800 text-xs mt-0.5">${Number(b.amount).toFixed(2)}</p>
                              </div>
                              <span className="px-1.5 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-bold rounded uppercase tracking-wider">
                                {b.status}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                    
                    {/* Quotes */}
                    <div className="md:col-span-2 bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-2 border-b border-slate-200 bg-slate-50 font-bold text-slate-700 flex items-center gap-2 text-xs">
                        <FileText className="w-3.5 h-3.5 text-blue-600" /> Quotes
                      </div>
                      <div className="p-0 overflow-x-auto">
                        <table className="w-full text-[11px] text-left">
                          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider">
                            <tr>
                              <th className="px-3 py-2 border-b">Date</th>
                              <th className="px-3 py-2 border-b">Labour / Parts</th>
                              <th className="px-3 py-2 border-b">Total</th>
                              <th className="px-3 py-2 border-b">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {customerDetails.quotes.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="p-3 text-center text-slate-500 italic">No quotes found.</td>
                              </tr>
                            ) : (
                              customerDetails.quotes.map((q: any) => (
                                <tr key={q.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                  <td className="px-3 py-2 text-slate-600">{formatDate(q.createdAt)}</td>
                                  <td className="px-3 py-2 text-slate-700">${q.labourCost} / ${q.partsCost}</td>
                                  <td className="px-3 py-2 font-bold text-slate-800">${q.totalCost}</td>
                                  <td className="px-3 py-2">
                                    <span className="px-1.5 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-bold rounded uppercase tracking-wider">
                                      {q.status}
                                    </span>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
            
            <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="px-3 py-1.5 border border-slate-300 rounded text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </RoleGuard>
  );
}
