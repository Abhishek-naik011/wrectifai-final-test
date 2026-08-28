'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { TopNavbar } from '@/components/home/top-navbar';
import { Modal } from '@/components/common/modal';
import { BookingDialog } from '@/components/customer/booking-dialog';
import { fetchQuotes, updateQuoteRequest, deleteQuoteRequest } from '@/lib/quotes-api';
import type { QuoteItem } from '@/components/quotes/quotes-shared';

export function QuotesPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingQuote, setBookingQuote] = useState<QuoteItem | null>(null);
  const [viewQuote, setViewQuote] = useState<QuoteItem | null>(null);
  const [viewDetailsQuote, setViewDetailsQuote] = useState<QuoteItem | null>(null);
  
  // Edit & Delete state
  const [editQuote, setEditQuote] = useState<QuoteItem | null>(null);
  const [editIssueSummary, setEditIssueSummary] = useState('');
  const [editPreferredDate, setEditPreferredDate] = useState('');
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [deleteConfirmQuote, setDeleteConfirmQuote] = useState<QuoteItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const formatStatus = (status?: string) => {
    if (!status) return 'Awaiting Quote';
    const s = status.toLowerCase();
    switch (s) {
      case 'open':
      case 'pending':
      case 'pendingpayment':
        return 'Awaiting Quote';
      case 'quoted':
        return 'Quoted';
      case 'selected':
        return 'Booked';
      case 'accepted':
        return 'Accepted';
      case 'in_progress':
      case 'repairing':
        return 'In Progress';
      case 'ready':
        return 'Ready';
      case 'completed':
        return 'Completed';
      case 'cancelled':
      case 'expired':
      case 'rejected':
        return 'Cancelled';
      case 'suspended':
        return 'Suspended';
      default:
        return 'Awaiting Quote';
    }
  };

  // Rule: If the quote request is unanswered / unreviewed (no quote submitted, status open/pending), allow edit and delete
  const canEditDelete = (quote: QuoteItem) => {
    if (quote.hasQuote || quote.quoteId) return false;
    if (quote.isBooked) return false;
    const reqStatus = (quote.requestStatus || quote.status || '').toLowerCase();
    return reqStatus === 'open' || reqStatus === 'pending' || reqStatus === 'pendingpayment';
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const quotesData = await fetchQuotes();
      setQuotes(quotesData);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    async function initLoad() {
      try {
        const quotesData = await fetchQuotes();
        if (active) setQuotes(quotesData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        if (active) setLoading(false);
      }
    }
    initLoad();

    const handleSync = () => {
      if (active) initLoad();
    };

    window.addEventListener('quote-updated', handleSync);
    window.addEventListener('storage', (e) => {
      if (e.key === 'wrectifai_sync_quotes') {
        handleSync();
      }
    });

    return () => {
      active = false;
      window.removeEventListener('quote-updated', handleSync);
    };
  }, []);

  const handleOpenEdit = (quote: QuoteItem) => {
    setEditQuote(quote);
    setEditIssueSummary(quote.requestIssueSummary || '');
    setEditPreferredDate(quote.preferredDate ? quote.preferredDate.slice(0, 10) : '');
    setEditError(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editQuote) return;
    const targetRequestId = editQuote.quoteRequestId || editQuote.id;
    if (!targetRequestId) return;

    setIsSubmittingEdit(true);
    setEditError(null);
    try {
      await updateQuoteRequest(targetRequestId, {
        issueSummary: editIssueSummary,
        preferredDate: editPreferredDate || undefined,
      });
      setEditQuote(null);
      await loadData();
    } catch (err: any) {
      setEditError(err?.message || 'Failed to update quote request');
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleDeleteRequest = async () => {
    if (!deleteConfirmQuote) return;
    const targetRequestId = deleteConfirmQuote.quoteRequestId || deleteConfirmQuote.id;
    if (!targetRequestId) return;

    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteQuoteRequest(targetRequestId);
      setDeleteConfirmQuote(null);
      await loadData();
    } catch (err: any) {
      setDeleteError(err?.message || 'Failed to delete quote request');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardShell header={<TopNavbar />}>
      <div className="space-y-6 pb-6 p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">My Quotes</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
             Compare quotes from trusted garages and book the best one for your car.
          </p>
        </div>

        <div className="bg-white dark:bg-[#1A2233] rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-100 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400">Garage</th>
                  <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400">Submitted Date</th>
                  <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400">Total</th>
                  <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400">Days</th>
                  <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400">Status</th>
                  <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">Loading quotes...</td>
                  </tr>
                ) : quotes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">No quote requests sent yet.</td>
                  </tr>
                ) : quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-slate-50 dark:bg-[#121826]">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {(quote as any).garageName || quote.garage}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {quote.requestCreatedAt ? new Date(quote.requestCreatedAt).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {quote.price || `$${(quote as any).amount || (quote as any).totalCost || 0}`}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {quote.time || 'TBD'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                        {formatStatus(quote.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* If unanswered and no quote, show Edit and Delete */}
                      {canEditDelete(quote) && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(quote)}
                            className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded font-bold text-xs hover:bg-blue-100 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setDeleteConfirmQuote(quote);
                              setDeleteError(null);
                            }}
                            className="bg-red-50 text-red-600 px-3 py-1.5 rounded font-bold text-xs hover:bg-red-100 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}

                      {/* If quote received and not booked / not cancelled */}
                      {!canEditDelete(quote) && !quote.isBooked && quote.status !== 'rejected' && quote.status !== 'cancelled' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViewQuote(quote)}
                            className="bg-slate-100 text-slate-700 px-4 py-2 rounded font-bold text-sm hover:bg-slate-200 transition-colors"
                          >
                            View Quote
                          </button>
                        </div>
                      )}

                      {/* If booked */}
                      {quote.isBooked && (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-emerald-600 font-bold text-sm px-3 py-2 bg-emerald-50 rounded">Booked ✓</span>
                          <button
                            onClick={() => setViewDetailsQuote(quote)}
                            className="bg-slate-100 text-slate-700 px-4 py-2 rounded font-bold text-sm hover:bg-slate-200 transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {bookingQuote && (
        <BookingDialog 
          quote={bookingQuote} 
          onClose={() => setBookingQuote(null)}
          onSuccess={() => {
            setBookingQuote(null);
            window.dispatchEvent(new Event('dashboard_refresh'));
            const loadData = async () => {
              setLoading(true);
              try {
                const quotesData = await fetchQuotes();
                setQuotes(quotesData);
              } catch (err) {
                console.error('Failed to fetch data:', err);
              } finally {
                setLoading(false);
              }
            };
            loadData();
          }}
        />
      )}
      {viewQuote && (
        <Modal isOpen={true} onClose={() => setViewQuote(null)} title="Quote Details" className="max-w-2xl">
          <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm text-slate-700">
            <div>
              <span className="block font-bold text-slate-500 dark:text-slate-400 mb-1">Quote ID</span>
              <p className="font-semibold">{viewQuote.id}</p>
            </div>
            <div>
              <span className="block font-bold text-slate-500 dark:text-slate-400 mb-1">Created Date</span>
              <p className="font-semibold">{viewQuote.requestCreatedAt ? new Date(viewQuote.requestCreatedAt).toLocaleString() : 'N/A'}</p>
            </div>
            <div>
              <span className="block font-bold text-slate-500 dark:text-slate-400 mb-1">Garage Name</span>
              <p className="font-semibold">{(viewQuote as any).garageName || viewQuote.garage}</p>
            </div>
            <div>
              <span className="block font-bold text-slate-500 dark:text-slate-400 mb-1">Garage Address</span>
              <p className="font-semibold">{(viewQuote as any).garageAddress || 'N/A'}</p>
            </div>
            <div>
              <span className="block font-bold text-slate-500 dark:text-slate-400 mb-1">Customer Name</span>
              <p className="font-semibold">{viewQuote.customerName || 'N/A'}</p>
            </div>
            <div>
              <span className="block font-bold text-slate-500 dark:text-slate-400 mb-1">Vehicle</span>
              <p className="font-semibold">
                {viewQuote.vehicle ? `${viewQuote.vehicle.make} ${viewQuote.vehicle.model} ${viewQuote.vehicle.year}` : 'N/A'}
              </p>
            </div>
            <div className="col-span-2">
              <span className="block font-bold text-slate-500 dark:text-slate-400 mb-1">Issue Description</span>
              <p className="bg-slate-50 dark:bg-[#121826] p-3 rounded border border-slate-200 dark:border-slate-700">
                {viewQuote.requestIssueSummary || 'N/A'}
              </p>
            </div>
            <div>
              <span className="block font-bold text-slate-500 dark:text-slate-400 mb-1">Labour Cost</span>
              <p className="font-semibold">{viewQuote.details?.labour ? `USD ${viewQuote.details.labour}` : 'N/A'}</p>
            </div>
            <div>
              <span className="block font-bold text-slate-500 dark:text-slate-400 mb-1">Parts Cost</span>
              <p className="font-semibold">{viewQuote.details?.parts ? `USD ${viewQuote.details.parts}` : 'N/A'}</p>
            </div>
            <div>
              <span className="block font-bold text-slate-500 dark:text-slate-400 mb-1">Other Charges</span>
              <p className="font-semibold">{viewQuote.details?.other ? `USD ${viewQuote.details.other}` : 'N/A'}</p>
            </div>
            <div>
              <span className="block font-bold text-slate-500 dark:text-slate-400 mb-1">Total Amount</span>
              <p className="font-bold text-blue-700">{viewQuote.price || `$${(viewQuote as any).amount || (viewQuote as any).totalCost || 0}`}</p>
            </div>
            <div>
              <span className="block font-bold text-slate-500 dark:text-slate-400 mb-1">Estimated Days</span>
              <p className="font-semibold">{viewQuote.time || 'N/A'}</p>
            </div>
            <div>
              <span className="block font-bold text-slate-500 dark:text-slate-400 mb-1">Warranty</span>
              <p className="font-semibold">{viewQuote.metaSecondary || 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <span className="block font-bold text-slate-500 dark:text-slate-400 mb-1">Garage Notes</span>
              <p className="bg-slate-50 dark:bg-[#121826] p-3 rounded border border-slate-200 dark:border-slate-700">
                {viewQuote.details?.remarks || 'N/A'}
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button 
              onClick={() => setViewQuote(null)}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded font-bold hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
            <button 
              onClick={() => {
                const quoteToBook = viewQuote;
                setViewQuote(null);
                setBookingQuote(quoteToBook);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition-colors"
            >
              Book Now
            </button>
          </div>
        </Modal>
      )}
      {viewDetailsQuote && (
        <Modal isOpen={true} onClose={() => setViewDetailsQuote(null)} title="Booking Details" className="max-w-2xl">
          <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm text-slate-700">
            <div>
              <span className="block font-bold text-slate-500 dark:text-slate-400 mb-1">Booking ID</span>
              <p className="font-semibold">{viewDetailsQuote.bookingDetails?.id || 'N/A'}</p>
            </div>
            <div>
              <span className="block font-bold text-slate-500 dark:text-slate-400 mb-1">Quote ID</span>
              <p className="font-semibold">{viewDetailsQuote.id}</p>
            </div>
            <div>
              <span className="block font-bold text-slate-500 dark:text-slate-400 mb-1">Garage Name</span>
              <p className="font-semibold">{viewDetailsQuote.garage}</p>
            </div>
            <div>
              <span className="block font-bold text-slate-500 dark:text-slate-400 mb-1">Customer Name</span>
              <p className="font-semibold">{viewDetailsQuote.customerName || 'N/A'}</p>
            </div>
            <div>
              <span className="block font-bold text-slate-500 dark:text-slate-400 mb-1">Vehicle</span>
              <p className="font-semibold">
                {viewDetailsQuote.vehicle ? `${viewDetailsQuote.vehicle.make} ${viewDetailsQuote.vehicle.model} ${viewDetailsQuote.vehicle.year}` : 'N/A'}
              </p>
            </div>
            <div>
              <span className="block font-bold text-slate-500 dark:text-slate-400 mb-1">Vehicle Number / VIN</span>
              <p className="font-semibold">{viewDetailsQuote.vehicle?.vin || 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <span className="block font-bold text-slate-500 dark:text-slate-400 mb-1">Issue Description</span>
              <p className="bg-slate-50 dark:bg-[#121826] p-3 rounded border border-slate-200 dark:border-slate-700">
                {viewDetailsQuote.requestIssueSummary || 'N/A'}
              </p>
            </div>
            <div>
              <span className="block font-bold text-slate-500 dark:text-slate-400 mb-1">Estimated Days</span>
              <p className="font-semibold">{viewDetailsQuote.time || 'N/A'}</p>
            </div>
            <div>
              <span className="block font-bold text-slate-500 dark:text-slate-400 mb-1">Quote Amount</span>
              <p className="font-semibold text-blue-700">{viewDetailsQuote.price || 'N/A'}</p>
            </div>
            <div>
              <span className="block font-bold text-slate-500 dark:text-slate-400 mb-1">Preferred Date</span>
              <p className="font-semibold">
                {viewDetailsQuote.bookingDetails?.scheduledAt ? new Date(viewDetailsQuote.bookingDetails.scheduledAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <span className="block font-bold text-slate-500 dark:text-slate-400 mb-1">Preferred Time</span>
              <p className="font-semibold">
                {viewDetailsQuote.bookingDetails?.scheduledAt ? new Date(viewDetailsQuote.bookingDetails.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
              </p>
            </div>
            <div>
              <span className="block font-bold text-slate-500 dark:text-slate-400 mb-1">Booking Status</span>
              <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded uppercase">
                {viewDetailsQuote.bookingDetails?.status || 'N/A'}
              </span>
            </div>
            <div>
              <span className="block font-bold text-slate-500 dark:text-slate-400 mb-1">Booking Created Date</span>
              <p className="font-semibold">
                {viewDetailsQuote.bookingDetails?.createdAt ? new Date(viewDetailsQuote.bookingDetails.createdAt).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button 
              onClick={() => setViewDetailsQuote(null)}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded font-bold hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* Edit Quote Request Modal */}
      {editQuote && (
        <Modal
          isOpen={true}
          onClose={() => {
            if (!isSubmittingEdit) setEditQuote(null);
          }}
          title="Edit Quote Request"
          className="max-w-lg"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            {editError && (
              <div className="p-3 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded">
                {editError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Garage
              </label>
              <input
                type="text"
                disabled
                value={(editQuote as any).garageName || editQuote.garage}
                className="w-full text-sm bg-slate-50 dark:bg-[#121826] border border-slate-200 dark:border-slate-700 rounded p-2 text-slate-500 dark:text-slate-400 font-medium cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Vehicle
              </label>
              <input
                type="text"
                disabled
                value={
                  editQuote.vehicle
                    ? `${editQuote.vehicle.make} ${editQuote.vehicle.model} (${editQuote.vehicle.year})`
                    : 'N/A'
                }
                className="w-full text-sm bg-slate-50 dark:bg-[#121826] border border-slate-200 dark:border-slate-700 rounded p-2 text-slate-500 dark:text-slate-400 font-medium cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Issue Summary / Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={editIssueSummary}
                onChange={(e) => setEditIssueSummary(e.target.value)}
                placeholder="Describe your vehicle issue..."
                className="w-full text-sm border border-slate-300 rounded p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-normal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Preferred Date
              </label>
              <input
                type="date"
                value={editPreferredDate}
                onChange={(e) => setEditPreferredDate(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                disabled={isSubmittingEdit}
                onClick={() => setEditQuote(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded font-bold text-sm hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingEdit || !editIssueSummary.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmittingEdit ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmQuote && (
        <Modal
          isOpen={true}
          onClose={() => {
            if (!isDeleting) setDeleteConfirmQuote(null);
          }}
          title="Delete Quote Request"
          className="max-w-md"
        >
          <div className="space-y-4">
            {deleteError && (
              <div className="p-3 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded">
                {deleteError}
              </div>
            )}

            <p className="text-sm text-slate-600 dark:text-slate-400">
              Are you sure you want to delete this quote request sent to{' '}
              <span className="font-bold text-slate-800">
                {(deleteConfirmQuote as any).garageName || deleteConfirmQuote.garage}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="p-3 bg-slate-50 dark:bg-[#121826] border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-700 space-y-1">
              <div>
                <span className="font-semibold text-slate-500 dark:text-slate-400">Issue: </span>
                <span>{deleteConfirmQuote.requestIssueSummary || 'N/A'}</span>
              </div>
              {deleteConfirmQuote.vehicle && (
                <div>
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Vehicle: </span>
                  <span>
                    {deleteConfirmQuote.vehicle.make} {deleteConfirmQuote.vehicle.model} ({deleteConfirmQuote.vehicle.year})
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteConfirmQuote(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded font-bold text-sm hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteRequest}
                className="px-4 py-2 bg-red-600 text-white rounded font-bold text-sm hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardShell>
  );
}

export default QuotesPage;
