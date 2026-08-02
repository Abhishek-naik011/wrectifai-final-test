'use client';
import { useState } from 'react';
import { Modal } from '@/components/common/modal';
import { Button } from '@/components/common/button';
import { apiClient } from '@/lib/api-client';
import type { QuoteItem } from '@/components/quotes/quotes-shared';

export function BookingDialog({ quote, onClose, onSuccess }: { quote: QuoteItem, onClose: () => void, onSuccess: () => void }) {
  const [vehicle, setVehicle] = useState(quote.vehicle ? `${quote.vehicle.make} ${quote.vehicle.model} ${quote.vehicle.year}` : '');
  const [issueDescription, setIssueDescription] = useState(quote.requestIssueSummary || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueDescription.trim()) {
      setErrorMsg('Please describe the issue.');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await apiClient.post(`/bookings/from-quote/${quote.id}`, {
        vehicle,
        issueDescription,
        scheduledAt: quote.preferredDate || quote.requestCreatedAt || new Date().toISOString(),
      });
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to create booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <Modal isOpen={true} onClose={onClose} title="Book Appointment" className="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && <div className="p-3 bg-red-50 text-red-600 rounded text-sm font-semibold">{errorMsg}</div>}
        
        <div>
          <label className="block text-sm font-semibold mb-1">Vehicle</label>
          <input 
            type="text" 
            value={vehicle} 
            onChange={e => setVehicle(e.target.value)} 
            placeholder="e.g. Honda City 2018"
            className="w-full p-2 border rounded border-slate-300"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Issue Description <span className="text-red-500">*</span></label>
          <textarea
            value={issueDescription}
            onChange={e => setIssueDescription(e.target.value)}
            placeholder="Please describe the issue..."
            className="w-full p-2 border rounded border-slate-300 h-24"
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button variant="default" type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
            {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
