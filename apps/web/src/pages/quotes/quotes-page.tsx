'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { TopNavbar } from '@/components/home/top-navbar';
import { BookingDialog } from '@/components/customer/booking-dialog';
import { fetchQuotes } from '@/lib/quotes-api';
import type { QuoteItem } from '@/components/quotes/quotes-shared';

export function QuotesPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingQuote, setBookingQuote] = useState<QuoteItem | null>(null);

  const formatStatus = (status?: string) => {
    if (!status) return '';
    const s = status.toLowerCase();
    switch (s) {
      case 'open':
      case 'pending':
        return 'Pending Quote';
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
        return 'Cancelled';
      case 'rejected':
        return 'Rejected';
      default:
        return s.charAt(0).toUpperCase() + s.slice(1);
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const quotesData = await fetchQuotes();
        setQuotes(quotesData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <DashboardShell header={<TopNavbar />}>
      <div className="space-y-6 pb-6 p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">My Quotes</h1>
          <p className="mt-2 text-sm text-slate-600">
             Compare quotes from trusted garages and book the best one for your car.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-600">Garage</th>
                  <th className="px-6 py-4 font-bold text-slate-600">Total</th>
                  <th className="px-6 py-4 font-bold text-slate-600">Days</th>
                  <th className="px-6 py-4 font-bold text-slate-600">Status</th>
                  <th className="px-6 py-4 font-bold text-slate-600 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading quotes...</td>
                  </tr>
                ) : quotes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No quotes received yet.</td>
                  </tr>
                ) : quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {(quote as any).garageName || quote.garage}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {quote.price || `$${(quote as any).amount || (quote as any).totalCost || 0}`}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {quote.details?.estimatedTime || (quote as any).eta_note || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                        {formatStatus(quote.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!quote.isBooked && quote.status !== 'rejected' && (
                        <button
                          onClick={() => setBookingQuote(quote)}
                          className="bg-blue-600 text-white px-4 py-2 rounded font-bold text-sm hover:bg-blue-700 transition-colors"
                        >
                          Book Now
                        </button>
                      )}
                      {quote.isBooked && (
                        <span className="text-slate-500 font-bold text-sm px-4 py-2 bg-slate-100 rounded cursor-not-allowed">Booked ✓</span>
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
            window.location.reload();
          }}
        />
      )}
    </DashboardShell>
  );
}

export default QuotesPage;
