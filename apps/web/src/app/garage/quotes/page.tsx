'use client';

import { useState, useEffect } from 'react';
import { RoleGuard } from '@/components/common/role-guard';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { Card } from '@/components/common/card';
import { garageNavItems } from '@/lib/garage-config';
import { DashboardHeader } from '@/components/common/dashboard-header';
import { fetchGarageQuotes, GarageQuote } from '@/lib/quotes-api';

export default function GarageQuotesPage() {
  const [quotes, setQuotes] = useState<GarageQuote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchGarageQuotes();
        setQuotes(data);
      } catch (err) {
        console.error('Failed to load quotes:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <RoleGuard allowedRoles={['garage']}>
      <DashboardShell customNavItems={garageNavItems} hideBottomWidget={true} header={<DashboardHeader />}>
        <div className="space-y-6 p-4 max-w-6xl mx-auto w-full">
          <div>
            <h1 className="text-2xl font-bold text-[#17307a]">Generated Quotes</h1>
            <p className="text-sm text-gray-500">All quotes you have generated</p>
          </div>

          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a56db]"></div>
            </div>
          ) : quotes.length === 0 ? (
            <Card className="p-12 text-center border-dashed border-2 border-gray-200">
              <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#17307a] mb-2">No Quotes</h3>
              <p className="text-sm text-gray-500">You haven't generated any quotes yet.</p>
            </Card>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-[#e4ecff] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-[#f2f6ff] text-[#17307a] text-xs uppercase font-semibold">
                    <tr>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Vehicle</th>
                      <th className="px-6 py-4 text-right">Labour</th>
                      <th className="px-6 py-4 text-right">Parts</th>
                      <th className="px-6 py-4 text-right">Total</th>
                      <th className="px-6 py-4">ETA</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e4ecff]">
                    {quotes.map((quote) => (
                      <tr key={quote.id} className="hover:bg-[#fcfdff] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold overflow-hidden shrink-0">
                              {quote.customerAvatar ? (
                                <img src={quote.customerAvatar} alt={quote.customerName} className="w-full h-full object-cover" />
                              ) : (
                                quote.customerName?.charAt(0).toUpperCase() || 'C'
                              )}
                            </div>
                            <span className="font-semibold text-[#17307a] whitespace-nowrap">{quote.customerName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap">
                          {quote.vehicleMake} {quote.vehicleModel}
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">${Number(quote.laborCost).toLocaleString()}</td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">${Number(quote.partsCost).toLocaleString()}</td>
                        <td className="px-6 py-4 font-bold text-right text-[#17307a] whitespace-nowrap">${Number(quote.totalCost).toLocaleString()}</td>
                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{quote.etaNote || (quote.etaDays ? `${quote.etaDays} days` : 'N/A')}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${
                            quote.quoteStatus === 'active' ? 'bg-blue-100 text-blue-700' : 
                            quote.quoteStatus === 'selected' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {quote.quoteStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                          {new Date(quote.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button className="text-[#1a56db] hover:underline text-xs font-semibold">View Quote</button>
                            {quote.quoteStatus === 'draft' && (
                              <button className="text-orange-600 hover:underline text-xs font-semibold">Edit Quote</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </DashboardShell>
    </RoleGuard>
  );
}
