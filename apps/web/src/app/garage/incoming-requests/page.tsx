'use client';

import { useState, useEffect } from 'react';
import { RoleGuard } from '@/components/common/role-guard';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { Card } from '@/components/common/card';
import { garageNavItems } from '@/lib/garage-config';
import { DashboardHeader } from '@/components/common/dashboard-header';
import { Inbox, CheckCircle, XCircle, Clock, FileText, Wrench, ChevronRight, X, MapPin } from 'lucide-react';
import { getGarageIncomingRequests, submitGarageQuote, QuoteRequestResponse, acceptQuoteRequest } from '@/lib/quotes-api';

interface ExtendedQuoteRequest extends QuoteRequestResponse {
  quoted?: boolean;
}

export default function IncomingRequestsPage() {
  const [requests, setRequests] = useState<ExtendedQuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectedIds, setRejectedIds] = useState<string[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ExtendedQuoteRequest | null>(null);

  // Quote form state
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [labourCost, setLabourCost] = useState('');
  const [partsCost, setPartsCost] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [remarks, setRemarks] = useState('');
  const [submittingQuote, setSubmittingQuote] = useState(false);

  useEffect(() => {
    const storedRejects = localStorage.getItem('garage_rejected_requests');
    if (storedRejects) {
      try {
        setRejectedIds(JSON.parse(storedRejects));
      } catch (e) {}
    }

    async function load() {
      try {
        const data = await getGarageIncomingRequests();
        setRequests(data);
      } catch (err) {
        console.error('Failed to load requests:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleReject = (id: string) => {
    const newRejects = [...rejectedIds, id];
    setRejectedIds(newRejects);
    localStorage.setItem('garage_rejected_requests', JSON.stringify(newRejects));
    setSelectedRequest(null);
    setShowQuoteForm(false);
  };

  const handleAcceptAndQuoteClick = async () => {
    if (!selectedRequest) return;
    try {
      await acceptQuoteRequest(selectedRequest.id);
      setShowQuoteForm(true);
    } catch (err) {
      console.error('Failed to accept request:', err);
      alert('Failed to accept request. It may no longer be available.');
    }
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    
    setSubmittingQuote(true);
    try {
      await submitGarageQuote(selectedRequest.id, {
        labourCost: Number(labourCost) || 0,
        partsCost: Number(partsCost) || 0,
        estimatedTime,
        remarks,
      });
      
      setRequests(reqs => reqs.map(r => r.id === selectedRequest.id ? { ...r, quoted: true } : r));
      
      setSelectedRequest(null);
      setShowQuoteForm(false);
      
      setLabourCost('');
      setPartsCost('');
      setEstimatedTime('');
      setRemarks('');
    } catch (err) {
      console.error('Failed to submit quote:', err);
      alert('Failed to submit quote. Please try again.');
    } finally {
      setSubmittingQuote(false);
    }
  };

  const visibleRequests = requests.filter(req => !rejectedIds.includes(req.id));

  return (
    <RoleGuard allowedRoles={['garage']}>
      <DashboardShell customNavItems={garageNavItems} hideBottomWidget={true} header={<DashboardHeader />}>
        <div className="space-y-6 p-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#17307a]">Incoming Requests</h1>
            <p className="text-sm text-gray-500">Review service requests from customers</p>
          </div>

          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin h-8 w-8 border-4 border-[#17307a] border-t-transparent rounded-full"></div>
            </div>
          ) : visibleRequests.length === 0 ? (
            <Card className="p-16 flex flex-col items-center justify-center text-center border border-gray-100 bg-white shadow-sm min-h-[50vh]">
              <div className="h-20 w-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
                <Inbox className="h-10 w-10" />
              </div>
              <h2 className="text-xl font-bold text-[#17307a] mb-2">No incoming requests yet</h2>
              <p className="text-gray-500 max-w-md">
                When a customer requests a diagnosis or service, it will appear here.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {visibleRequests.map(req => (
                <Card key={req.id} className="p-4 border border-gray-100 bg-white shadow-sm hover:border-blue-100 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {req.customerAvatar ? (
                        <img src={req.customerAvatar} alt={req.customerName || 'Customer'} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                          {(req.customerName || 'C')[0]}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">{req.customerName || 'Customer'}</h3>
                        <p className="text-xs text-gray-500">
                          {req.vehicle ? `${req.vehicle.make} ${req.vehicle.model}` : 'Unknown Vehicle'} • {new Date(req.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="hidden md:block flex-1 max-w-md px-6">
                      <p className="text-sm text-gray-600 truncate">{req.issueSummary}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      {req.quoted ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-sm font-medium">
                          <CheckCircle className="w-4 h-4" />
                          Quoted
                        </span>
                      ) : (
                        <button
                          onClick={() => { setSelectedRequest(req); setShowQuoteForm(false); }}
                          className="flex items-center gap-2 bg-[#17307a] text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-[#1a388e] transition-colors whitespace-nowrap"
                        >
                          Review Request
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DashboardShell>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <Card className="w-full max-w-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-[#17307a]">Request Details</h2>
              <button 
                onClick={() => { setSelectedRequest(null); setShowQuoteForm(false); }}
                className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Header Info */}
              <div className="flex items-start gap-4">
                {selectedRequest.customerAvatar ? (
                  <img src={selectedRequest.customerAvatar} alt={selectedRequest.customerName || 'Customer'} className="w-14 h-14 rounded-full object-cover" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xl">
                    {(selectedRequest.customerName || 'C')[0]}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{selectedRequest.customerName || 'Customer'}</h3>
                  <div className="text-sm text-gray-500 flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(selectedRequest.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Remote Request</span>
                  </div>
                </div>
              </div>

              {/* Vehicle & Diagnosis */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Wrench className="w-3.5 h-3.5" /> Vehicle</h4>
                  {selectedRequest.vehicle ? (
                    <div className="space-y-1 text-sm text-gray-900">
                      <p><strong>Make:</strong> {selectedRequest.vehicle.make}</p>
                      <p><strong>Model:</strong> {selectedRequest.vehicle.model}</p>
                      <p><strong>Year:</strong> {selectedRequest.vehicle.year}</p>
                      {selectedRequest.vehicle.vin && <p><strong>VIN:</strong> {selectedRequest.vehicle.vin}</p>}
                      {selectedRequest.vehicle.mileage !== undefined && selectedRequest.vehicle.mileage !== null && <p><strong>Mileage:</strong> {selectedRequest.vehicle.mileage} miles</p>}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No vehicle details provided</p>
                  )}
                </div>

                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <h4 className="text-xs font-semibold text-[#17307a] uppercase tracking-wider mb-2 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Issues</h4>
                  <p className="text-sm text-gray-800 leading-relaxed">{selectedRequest.issueSummary}</p>
                </div>
              </div>

              {/* Quote Form */}
              {showQuoteForm && (
                <div className="mt-4 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-4">
                  <h4 className="font-bold text-[#17307a] mb-4">Generate Quote</h4>
                  <form id="quote-form" onSubmit={handleQuoteSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Labour Cost ($)</label>
                        <input type="number" required min="0" step="0.01" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#17307a] bg-white" value={labourCost} onChange={(e) => setLabourCost(e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Parts Cost ($)</label>
                        <input type="number" required min="0" step="0.01" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#17307a] bg-white" value={partsCost} onChange={(e) => setPartsCost(e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Time (e.g. 2 days)</label>
                      <input type="text" required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#17307a] bg-white" value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)} placeholder="e.g. 2 days, 4 hours" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Remarks / Notes</label>
                      <textarea className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#17307a] bg-white resize-none" rows={3} value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Any special notes for the customer..." />
                    </div>
                  </form>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
              {!showQuoteForm ? (
                <>
                  <button onClick={() => handleReject(selectedRequest.id)} className="px-6 py-2.5 rounded-xl font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
                    Reject
                  </button>
                  <button onClick={handleAcceptAndQuoteClick} className="bg-[#17307a] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#1a388e] transition-colors shadow-sm">
                    Accept & Quote
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setShowQuoteForm(false)} className="px-6 py-2.5 rounded-xl font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" form="quote-form" disabled={submittingQuote} className="bg-[#17307a] text-white px-8 py-2.5 rounded-xl font-medium hover:bg-[#1a388e] transition-colors shadow-sm disabled:opacity-50">
                    {submittingQuote ? 'Submitting...' : 'Submit Quote'}
                  </button>
                </>
              )}
            </div>
          </Card>
        </div>
      )}
    </RoleGuard>
  );
}
